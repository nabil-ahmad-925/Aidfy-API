import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'; 
import * as iam from "aws-cdk-lib/aws-iam"; 
import { LAMBDA_CONFIG, StageName } from '../shared/constants';
// import { getEnvironmentConfig } from '../environment';
import path from 'path';


interface LambdaStackProps extends cdk.StackProps {
  stage: StageName; 
}

export class LambdaStack extends cdk.Stack {
  private readonly stage: StageName;
//   private readonly environmentConfig: { [key: string]: string };
  private readonly memorySize: number;
  private readonly provisionedConcurrentExecutions: number;
  public readonly authLambda: lambda.DockerImageFunction;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.stage = props.stage;
    // this.environmentConfig = getEnvironmentConfig(this, this.stage);
    this.memorySize = 4096;  
    this.provisionedConcurrentExecutions = this.stage === "PROD" ? 5 : 0; 

    console.log(`Deploying LambdaStack for stage: ${this.stage}`);
    // console.log(`Setting environment variables: ${JSON.stringify(this.environmentConfig)}`);
 
    const adminLambdaRole = this.createIrisEduAdminLambdaRole();
    this.authLambda = this.createIrisEduAuthLambdaFunction( adminLambdaRole);

    }

  private createIrisEduAdminLambdaRole(): iam.Role {
    const role = new iam.Role(this, `IrisEduAdminLambdaRole-${this.stage}`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
      ],
    });

 
    role.addToPolicy(
        new iam.PolicyStatement({
          actions: ["ssm:GetParameter", "ssm:GetParametersByPath"],
          resources: [
            `arn:aws:ssm:${this.region}:${this.account}:parameter/iris/${this.stage}/edu/*`,
          ],
        })
    );

    return role;
  }

  private createIrisEduAuthLambdaFunction( lambdaRole: iam.Role):  any {

     const authFunction = new lambda.Function(this, 'AuthFunction', {
      functionName: LAMBDA_CONFIG.AUTH_FUNCTION_NAME,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/lambdas/auth-service')),
      role:lambdaRole,
      timeout: cdk.Duration.seconds(LAMBDA_CONFIG.TIMEOUT_SECONDS),
      memorySize: LAMBDA_CONFIG.MEMORY_SIZE_MB,
      environment: {
        STAGE: this.stage
      },
      
    });

 
    return authFunction;
  }
 


}