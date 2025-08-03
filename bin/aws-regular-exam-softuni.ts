#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsRegularExamSoftuniStack } from '../lib/aws-regular-exam-softuni-stack';

const app = new cdk.App();
new AwsRegularExamSoftuniStack(app, 'AwsRegularExamSoftuniStack', {
    env: {
        region: 'eu-central-1',
    }
});