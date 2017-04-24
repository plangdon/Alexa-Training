// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

var http = require('http');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GetAirQuality" === intentName) {
        getAir(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add Cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Air Quality Report. " +
        "Please say a City and State or a Zip Code.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can get help by asking, " +
       "help!";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "To use the Air Quality Report " +
        "say a city and state or zip code.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Say a zip code or city and state.";
    //    "synonym for little";

    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using Air Supply. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



function makeTheRequest(city,state,zip,theoResponseCallback) {


   if (city===undefined&&state===undefined&&zip===undefined) {
     theoResponseCallback(new Error('undefined'));
   }




var query_url ='http://api.breezometer.com/baqi/?location=';


  if (city!==undefined){
      query_url += city + '&';
  }

  if (state!==undefined){
      query_url += state + '&';
  }

  if (zip!==undefined){
      query_url += zip + '&';
  }

  query_url += 'key=xxxxxx';


  console.log(`query_url: ${query_url}`);

  var body = '';

  http.get(query_url, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    if (res.statusCode==200) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', () => {
          console.log("RequestBody: " + body);

           theoResponseCallback(null, body);

        });
    }
    else {
      console.log(`Got error: ${res.statusCode}`);
      theoResponseCallback(new Error(res.statusCode));
    }
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
     theoResponseCallback(new Error(e.message));
  });
}


function getAir(intent, session, callback) {
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var maxLength = 0;




    makeTheRequest( intent.slots.City.value, intent.slots.State.value, intent.slots.Zip.value, function theoResponseCallback(err, theoResponseBody) {
        var speechOutput;

        if (err) {
            if (err=='undefiend'){
                 speechOutput = "Sorry, I can not find a report for the provided value. Please try saying your City and State, or Zipcode.";
            }
            else {
                speechOutput = "Sorry, I can not find a report for the provided value. Please try saying your City and State, or Zipcode.";
            }

        } else {

            var theoResponse = JSON.parse(theoResponseBody);

            speechOutput = "Here's the current status: ";

            if (theoResponse.hasOwnProperty('breezometer_description')){

                speechOutput += theoResponse.breezometer_description + '..., ';

            }

            if (theoResponse.random_recommendations.hasOwnProperty('outside')){

                speechOutput += theoResponse.random_recommendations.outside + '. ';

            }

            if (theoResponse.random_recommendations.hasOwnProperty('sport')){

                speechOutput += 'If you are going out to exercise, ';
                speechOutput += theoResponse.random_recommendations.sport;

            }

        }

        callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    });

}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },

        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },

        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}