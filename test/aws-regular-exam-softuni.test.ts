import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AwsRegularExamSoftuni from '../lib/aws-regular-exam-softuni-stack';

test('Snapshot of the entire stack', () => {
    const app = new cdk.App();
    const stack = new AwsRegularExamSoftuni.AwsRegularExamSoftuniStack(app, 'MySnapshotStack');

    const template = Template.fromStack(stack);

    expect(template.toJSON()).toMatchSnapshot();
});
