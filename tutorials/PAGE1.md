#### Skill Creation Steps
## 1. Create the Skill <a id="title"></a>
<hr />


1. Login to [developer.amazon.com](https://developer.amazon.com) and click Alexa, then Alexa Skills Kit.
1. Create a new Skill called **fact skill** with invocation name ```fact skill```.
1. Paste in the [Intents.json](./labs/lab1/SpeechAssets/Intents.json) :


```
{
  "intents": [
    {
      "intent": "GetNewFactIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
 }

```

1. Paste in the [Utterances.txt](./labs/lab1/speechAssets/Utterances.txt) :

```
GetNewFactIntent a fact
GetNewFactIntent tell me a fact
GetNewFactIntent to tell me a fact
GetNewFactIntent give me a fact
GetNewFactIntent tell me trivia
GetNewFactIntent give me trivia
GetNewFactIntent give me some information
GetNewFactIntent tell me something
GetNewFactIntent give me something
GetNewFactIntent to tell me something
GetNewFactIntent to give me something
```

Pause here and leave this browser tab open.

#### Continue to the next step

 * [Part 2 - Create the Lambda function](./PAGE2.md#title)
