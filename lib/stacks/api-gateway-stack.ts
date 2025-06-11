import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { API_CONFIG, StageName } from '../shared/constants';

interface ApiGatewayStackProps extends cdk.StackProps {
  stage: StageName;
  authFunction: lambda.Function;
}

// Custom Lambda Integration class to control permissions
class LambdaIntegrationNoPermission extends apigateway.LambdaIntegration {
  constructor(handler: lambda.IFunction, options?: apigateway.LambdaIntegrationOptions) {
    super(handler, options);
  }

  bind(method: apigateway.Method): apigateway.IntegrationConfig {
    const integrationConfig = super.bind(method);

    // Remove any auto-generated cfn permissions
    const permissions = method.node.children.filter(c => c instanceof lambda.CfnPermission);
    console.log(permissions);
    permissions.forEach(p => method.node.tryRemoveChild(p.node.id));
    return integrationConfig;
  }
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  private readonly stage: StageName;

  // Track resources that have been created to prevent duplicates
  private readonly resourcePathMap = new Map<string, apigateway.IResource>();

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    this.stage = props.stage;
    const { authFunction } = props;

    console.log(`Deploying ApiGatewayStack for stage: ${this.stage}`);

    // Create the REST API
    this.api = new apigateway.RestApi(this, `AdifyApi-${this.stage}`, {
      restApiName: `${API_CONFIG.API_NAME}-${this.stage.toLowerCase()}`,
      description: `Adify API Gateway - ${this.stage}`,
      deployOptions: {
        stageName: API_CONFIG.STAGE
      },
      binaryMediaTypes: ["multipart/form-data", "application/pdf", "application/octet-stream"]
    });

    // Store the root resource in our map
    this.resourcePathMap.set("/", this.api.root);

    // Output the API Gateway Rest API ID
    new cdk.CfnOutput(this, `ApiGatewayRestApiId-${this.stage}`, {
      value: this.api.restApiId,
      description: `API Gateway Rest API ID - ${this.stage}`,
      exportName: `AdifyApiGatewayId-${this.stage}`,
    });

    // Create auth routes
    this.createAuthRoutes(authFunction);

    // Grant API Gateway permission to invoke the Lambda function using CfnPermission
    new lambda.CfnPermission(this, `AuthLambdaInvokePermission-${this.stage}`, {
      functionName: authFunction.functionName,
      principal: 'apigateway.amazonaws.com',
      action: 'lambda:InvokeFunction',
      sourceArn: this.api.arnForExecuteApi('*'),
    });

    // Output the API URL
    new cdk.CfnOutput(this, `ApiUrl-${this.stage}`, {
      value: this.api.url,
      description: `URL of the API Gateway - ${this.stage}`,
      exportName: `AdifyApiUrl-${this.stage}`,
    });

    // Output individual endpoint URLs for convenience
    new cdk.CfnOutput(this, `SignupEndpoint-${this.stage}`, {
      value: `${this.api.url}auth/v1/signup`,
      description: `Signup endpoint URL - ${this.stage}`,
      exportName: `AdifySignupEndpoint-${this.stage}`,
    });

    new cdk.CfnOutput(this, `LoginEndpoint-${this.stage}`, {
      value: `${this.api.url}auth/v1/login`,
      description: `Login endpoint URL - ${this.stage}`,
      exportName: `AdifyLoginEndpoint-${this.stage}`,
    });

    console.log(`API Gateway stack created successfully for stage: ${this.stage}`);
  }

  // Get an existing resource or create a new one with CORS
  private getOrCreateResource(parent: apigateway.IResource, pathPart: string): apigateway.IResource {
    const fullPath = parent.path === "/"
      ? `/${pathPart}`
      : `${parent.path}/${pathPart}`;

    // Check if we've already created this resource
    if (this.resourcePathMap.has(fullPath)) {
      return this.resourcePathMap.get(fullPath)!;
    }

    // Create the resource
    const resource = parent.addResource(pathPart);

    // Add CORS options manually
    this.addCorsOptions(resource);

    // Store the resource in our map
    this.resourcePathMap.set(fullPath, resource);

    return resource;
  }

  private addCorsOptions(resource: apigateway.IResource) {
    resource.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,Authorization,x-refresh-token'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
        },
      }],
    });
  }

  private createAuthRoutes(authFunction: lambda.Function): void {
    // Use the custom integration to control permissions
    const integration = new LambdaIntegrationNoPermission(authFunction, { proxy: true });

    // Create auth resource structure: /auth/v1/
    const authResource = this.getOrCreateResource(this.api.root, "auth");
    const versionedAuthApi = this.getOrCreateResource(authResource, "v1");

    // Create signup endpoint: POST /auth/v1/signup
    const signupResource = this.getOrCreateResource(versionedAuthApi, "signup");
    signupResource.addMethod('POST', integration );

    // Create login endpoint: POST /auth/v1/login
    const loginResource = this.getOrCreateResource(versionedAuthApi, "login");
    loginResource.addMethod('POST', integration );
  }
}