#### Skill Creation Steps
## 2. Create the Lambda Function <a id="title"></a>
<hr />
*Leave the default values for any form inputs not described below.  To complete each page you will usually scroll down and find the blue button.*

1. Login to AWS and verify the region at the top right is set to **N. Virginia** Region region.
1. Click [Lambda](https://console.aws.amazon.com/lambda/home) and then **Create a Lambda function**  Do not select the default **Blank** blueprint.
1. Locate and click on the ```alexa-skill-kit-sdk-factskill``` skill template (hint: search for **fact** )
1. Click in the empty square and choose the trigger *Alexa Skills Kit* and click Next.
  + ![Alexa Skills Kit Trigger](https://m.media-amazon.com/images/G/01/cookbook/trigger._TTH_.png)
1. Give your function the name *FactSkill*
1. Select all the existing Javascript code and delete it!
1. Paste in the source code from [./labs/lab1/index.js](./labs/lab1/index.js)
1. Scroll down past the code editor and environment variables and find the **Role** dropdown.  Create a custom role or re-use an execution role, such as ```lambda_basic_execution```
1. Click Next and create the function.
1. Press the blue TEST button to begin a unit test.  Choose the event template called Alexa Start Session.
1. Notice Lambda ARN, shown near the top right, such as
 *  ``` arn:aws:lambda:us-east-1:777777777777:function:FactSkill ```


#### Continue to the next step

 * [Part 3 - Connect your skill to Lambda](./PAGE3.md#title)

