# Access Database (Persistence) Skill <a id="title">

User asks Alexa skill to remember something, user asks Alexa to recall.

* <b>index.js:</b> main code file

* SpeechAssets
    * <b>Intents.json:</b> Interaction model for this skill (copy and past into Interaction Model:Intent Schema)
    * <b>Utterances.txt:</b> Voice interactions for this skill (copy and past into Interaction Model:Sample Utterances)
    * <b>slotValues.txt:</b> Sample answer text (copy and past into Interaction Model:Custom Slot Types)
    * <b>ico108.png:</b> 108px example for icon (for Publishing Information:Images)
    * <b>ico512.png:</b> 512px example for icon (for Publishing Information:Images)


## Publishing Information:
Example Phrases
 * Alexa, ask note pad remember to walk the cat
 * Alexa, ask note pad help me remember to feed the fish
 * Remind me

## Database Setup
You must set up a DynamoDB table and grant access to be able to persist the data.

https://console.aws.amazon.com/dynamodb/home

Add New Table
* Click "Create table"
* Name the table - "alexaTest"
* Give it a Primary Key (Index) - "RequestId"


## Create User / Grant Access
You must create a user and grant access to DynamoDB

https://console.aws.amazon.com/iam/home#/home

#### Add New User
* Click "add user"
* Name user
* Access type: Programmatic access (checkbox)

#### Set Permissions
* Pick 3rd Box - Attach existing policies directly
* Type "Dynamo" in search filter
* Pick "AmazonDynamoDBFullAccess"

#### Save Access Information
* On screen you will see: Access key ID
* and Secret access key with "****** Show" - Click Show
** Important - <b>Copy and Save the access key</b> - you will not be able to access it later







 <hr />
 Back to the [Home Page](../../README.md#title)
