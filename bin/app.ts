import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../lib/stacks/lambda-stack';
import { ApiGatewayStack } from '../lib/stacks/api-gateway-stack';
import { DEFAULT_VALUES, StageName } from '../lib/shared/constants';

const app = new App();

const awsAccount = app.node.tryGetContext('awsAccount') || DEFAULT_VALUES.AWS_ACCOUNT;
const awsRegion = app.node.tryGetContext('awsRegion') || DEFAULT_VALUES.AWS_REGION;
const stage = 'dev' as const;
const stageUpper = stage.toUpperCase() as StageName;

console.log(`Starting deployment of Adify CDK stage... ${stageUpper}`);
console.log(`Using account: ${awsAccount} and region: ${awsRegion}`);

// Create Lambda Stack first
const lambdaStack = new LambdaStack(app, `Adify-LambdaStack-${stageUpper}`, {
  stage: stageUpper,
  env: {
    account: process.env.AWS_ACCOUNT_ID || DEFAULT_VALUES.AWS_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION || DEFAULT_VALUES.AWS_REGION,
  }
});

// Create API Gateway Stack with dependency on Lambda Stack
const apiGatewayStack = new ApiGatewayStack(app, `Adify-ApiGatewayStack-${stageUpper}`, {
  stage: stageUpper,
  authFunction: lambdaStack.authLambda,
  env: {
    account: process.env.AWS_ACCOUNT_ID || DEFAULT_VALUES.AWS_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION || DEFAULT_VALUES.AWS_REGION,
  }
});

// Add dependency to ensure Lambda stack is created before API Gateway stack
apiGatewayStack.addDependency(lambdaStack);

console.log('Stack dependencies configured');
console.log('Synthesizing CDK app...');

app.synth();