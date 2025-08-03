import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const currDynamoDB = new DynamoDBClient();

import * as uuid from 'uuid'

export const handler = async (event: any) => {
    console.log(JSON.stringify(event));
    const tableName = process.env.TABLE_NAME;
    const topicArn = process.env.TOPIC_ARN;

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { valid, value, description, buyer } = body;

    const orderId = uuid.v4();

    if (valid === false) {

        const putItemCommand = new PutItemCommand({
            Item: {
                PK: {
                    S: `Order#${orderId}`,
                },
                SK: {
                    S: `METADATA#${orderId}`
                },
                valid: {
                    S: `${valid}`,
                },
                value: {
                    N: `${value}`,
                },
                description: {
                    S: `${description}`,
                },
                buyer: {
                    S: `${buyer}`,
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: tableName,
        });

        const clientResponse = await currDynamoDB.send(putItemCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully retrieved ${tableName}`
            })
        };

    } else {

        const snsClient = new SNSClient({ region: 'eu-central-1' });

        await snsClient.send(
            new PublishCommand({
                TopicArn: topicArn,
                Subject: `New VALID order with ID:${orderId}`,
                Message: `Value: ${value}, description: ${description}, buyer: ${buyer}.`,
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully retrieved!`
            })
        };
    }
}
