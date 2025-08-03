import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";
import {Subscription, SubscriptionProtocol, Topic} from "aws-cdk-lib/aws-sns";


export class AwsRegularExamSoftuniStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //! DynamoDB:


    const table: cdk.aws_dynamodb.Table = new Table(this, 'Table', {

      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING
      },

    });


    //!!! EDN of DynamoDB


    //! Notification for new order:

    const orderTopic: cdk.aws_sns.Topic = new Topic(this, 'orderTopic', {});

    const orderSubscription: cdk.aws_sns.Subscription = new Subscription(this, 'orderSubscription', {
      topic:orderTopic,
      protocol: SubscriptionProtocol.EMAIL,
      endpoint: 'for.kfdbg@gmail.com'
    });


    //!!! END of Notification Logic


    //! LAMBDA:


    const fillTableFunction: cdk.aws_lambda_nodejs.NodejsFunction = new NodejsFunction(this, 'FillTableFunction', {
      runtime: Runtime.NODEJS_20_X,
      entry: __dirname + '/../lambda-src-re-s/fillTable.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
        TOPIC_ARN: orderTopic.topicArn
      },
    });

    //LAMBDA PERMISSIONS:

    orderTopic.grantPublish(fillTableFunction)
    table.grantWriteData(fillTableFunction)


    //!!! END OF LAMBDA


    //! REST API


    const ordersApi: cdk.aws_apigateway.RestApi = new RestApi(this, 'RestApi', {
      restApiName: 'OrdersApi',
    });

    // Resource:

    const orderResource = ordersApi.root.addResource('order')

    //POST method for this resource:

    orderResource.addMethod(HttpMethod.POST, new LambdaIntegration(fillTableFunction, {proxy: true}));


    //!!! EDN OF REST API

  }
}
