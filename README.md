# This project is made for educational purposes

![Diagram](./image.png)


### Technical Overview
To meet the project requirements, I implemented the following architecture:
* **API Gateway:** Configured with a POST method to handle incoming requests. ✅
* **Lambda Function:** Processes incoming order data in JSON format. ✅
* **DynamoDB:** Used to store **INVALID** orders. These entries are retained for manual review; in the event of a malicious attack, this data is preserved for reporting to the authorities. ✅
* **SNS Topic:** Configured to send email notifications exclusively for **VALID** orders. ✅

### Data Retention & Automation
There was a proposal to add automated deletion for items in DynamoDB. However, I recommend a manual review process for all **INVALID** orders. If a hacking attempt occurs, data must be stored for a longer period to allow authorities sufficient time for investigation. 

While manual review can be challenging at scale (e.g., over a million requests), the current workflow directs valid orders via email for processing by the team. 

#### Implementation Options for Automated Deletion:
If automation is required, it can be achieved using a second Lambda function triggered by **EventBridge**. 
* **Logic:** The Lambda checks the timestamp of invalid orders and deletes them if a specific limit (e.g., 30 minutes) is exceeded.
* **Scheduling:** EventBridge can be configured to trigger this Lambda every 30–60 minutes.
* **Cost Impact:** This approach increases operational costs. If the Lambda runs every 30 minutes and uses a `SCAN` operation to check items, the DynamoDB cost would be approximately **$360/month** for a million items.

### Testing & Usage
* **Testing:** To test the project before deployment, simply run: `npm test`
* **Usage:** Use **Postman** to send POST requests in JSON format after setting up your account.

### 💰 Pricing Estimates (Region: eu-central-1)
* **API Gateway:** ~ $11.10 per month (3,000,000 JSON objects * $3.70)
* **AWS Lambda:** ~ $1.00 per month
* **DynamoDB & SNS:** ~ $2.50 per month
* **Total Average Cost:** **~$14.60 per month** (excluding optional automated cleanup)

Example of VALID order:

{
"valid": true,
"value": 12,
"description": "5W40 motor oil",
"buyer": "Hristo"
}

Example for INVALID order:

{
"valid": false,
"value": 0,
"description": "Hacker attack",
"buyer": "Nobody"
}


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
