
var AWS = require('aws-sdk');

var dynamoDBConfiguration = {
    "accessKeyId": "xxxxxxxx",
    "secretAccessKey": "xxxxxx",
    "region": "us-east-1"
  };
AWS.config.update(dynamoDBConfiguration);
var dd = new AWS.DynamoDB();
var tableName = 'alexaTest';


var https = require('https');
var querystring = require('querystring');

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

    var myBirthdate;

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("BirthdayIntent" === intentName) {
        getInsp(intent.slots.birthdate.value,'Hourglass', session, callback);
    } else if ("HowLongIntent" === intentName) {
       getBirthdayFromSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}


function getBirthdayFromSession(intent, session, callback) {
    var myBirthdate;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        myBirthdate = session.attributes.myBirthdate;
    }

    if (myBirthdate) {
       getInsp(myBirthdate,'hourglass', session, callback);
    } else {
        speechOutput = "I'm not sure what your birthday is, please say My Birthday is Month Day Year.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
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
    var speechOutput = "Welcome to the Hourglass. " +
        "Tell me your birthday and I will tell you how much sand is left in the hourglass";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can get help by asking, help.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "To use the Hourglass, tell me your birthdate.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Say your birthdate in Month Day and Year.";
    //    "synonym for little";

    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you and live each day to it's fullist. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



function makeTheRequest(birthdate, session, theoResponseCallback) {

  var postData = querystring.stringify({
      'gender' : 'male',
      'birth' : birthdate
    });

 //path: '/time-left?gender=male&birth=' + birthdate,




  //try {
    //putItem = function(requestID,birthday) {
       // console.log(" putItem Function Called");
         var item = {'RequestId': { 'S': session.sessionId } , 'StateVal':{ 'S': birthdate } };



          console.log("Data: %j",item);

          var response = dd.putItem({
             'TableName': tableName,
             'Item': item
          }, function(err, data) {
              if (err) {
                console.log("Error in putItem "+err);
              } else {
                console.log("Successfully Inserted");
              }
          });

        //};

    //putItem('1234',birthdate);

  //} catch (error) {
   // context.fail("Caught: " + error);
  //}

//}



  var body = '';

  var options = {
      hostname: 'life-left.p.mashape.com',
      port: 443,
      path: '/time-left',
      method: 'POST',
       headers: {
        'X-Mashape-Key': 'xxxxxx',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    /*

 headers: {
        'X-Mashape-Key': 'PO2WabnK0zmshcvogVJAlC4a03HHp1LLuxjjsn7Lp6pQ29ChpH',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
*/

var req =  https.request(options, function(res) {
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

// write data to request body
req.write(postData);
req.end();



}



function createBirtdayAttributes(birthday) {
    return {
        birthday: birthday
    };
}

function getInsp(birthday, title, session, callback) {
    var repromptText = "You can ask me another.";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var maxLength = 0;


     if (birthday) {
        sessionAttributes = createBirtdayAttributes(birthday);

        if (birthday==='?') {
                speechOutput = "Please say your birthdate. Month Day and Year.";
                 callback(sessionAttributes,
                 buildSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
        }

        makeTheRequest(birthday, session, function theoResponseCallback(err, theoResponseBody) {
            var speechOutput;

            if (err) {
                if (err=='undefiend'){
                     speechOutput += "Sorry, the Hourglass is stuck with your request, please try again.";
                }
                else {
                    speechOutput += "Sorry, the Hourglass is stuck with your request. Please say just your birthdate.";
                }

            } else {

                var theoResponse = JSON.parse(theoResponseBody);

                speechOutput = 'Your life is ';
                speechOutput += Math.round(theoResponse.data.lifeComplete * 100);
                speechOutput += ' percent complete. You have ';
                speechOutput += theoResponse.data.dateString;
                speechOutput += ' remaining.';


            }

            callback(sessionAttributes,
                 buildSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = "I'm not sure what your birthday is. Please try again";
        repromptText = "I'm not sure what your birthday is. You can tell me your " +
            "birthday by saying, my birthday is March 4, 1971.";

        callback(sessionAttributes,
                 buildSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
    }





}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        /*
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        */
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