#### Skill Creation Steps
## 4. Testing your Skill <a id="title"></a>
<hr />

If you don't have a physical Alexa device to test with you can use a testing tool called Echosim.io



1. Within the AWS Lambda function page, the ARN, or Amazon Resource Name, is shown near the top right, such as
 *  ``` arn:aws:lambda:us-east-1:77777777777:function:FactSkill ```
1. Copy this ARN
 + ![Amazon Resource Name](https://m.media-amazon.com/images/G/01/cookbook/arn._TTH_.png)
1. Go to the browser tab at ```developer.amazon.com``` and navigate into your skill's Configuration page.
1. Click the radio button for Service Endpoint Type: AWS Lambda ARN
1. Pick a geographical region that is closest to your target customers
1. Click into the textbox that appears, and Paste.
1. Scroll down and click Save.
1. You should see a green checkbox next to the Configuration menu item.
1. If you get an error, confirm you have previously added an ASK Trigger to your Lambda function.


#### Test your skill

Open your skill and say 'tell me a fact'.  Verify the response is as expected.



<hr />
Back to the [Home Page](../../README.md#title)
