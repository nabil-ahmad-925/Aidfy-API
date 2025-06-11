 
import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../lib/stacks/lambda-stack';
import { DEFAULT_VALUES, StageName } from '../lib/shared/constants';

const app = new App(); 
const awsAccount = app.node.tryGetContext('awsAccount')||  DEFAULT_VALUES.AWS_ACCOUNT;
const awsRegion = app.node.tryGetContext('awsRegion') || DEFAULT_VALUES.AWS_REGION;
const stage = 'dev' as const;
const stageUpper = stage.toUpperCase() as StageName;
  
console.log('Starting deployment of IrisAICdk stage... ${stageUpper}');
console.log(`Using account: ${awsAccount} and region: ${awsRegion}`);

 
const lambdaStack = new LambdaStack(app, `Adify-LambdaStack-${stageUpper}`, {
  stage: stageUpper,
  env: {
    account: process.env.AWS_ACCOUNT_ID || DEFAULT_VALUES.AWS_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION || DEFAULT_VALUES.AWS_REGION,
  }
});

 
console.log('Stack dependencies configured');
console.log('Synthesizing CDK app...');

app.synth();