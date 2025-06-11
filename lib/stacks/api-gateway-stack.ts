// import * as cdk from 'aws-cdk-lib';
// import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import { Construct } from 'constructs';
// import { API_CONFIG } from '../shared/constants';

// interface ApiGatewayStackProps extends cdk.StackProps {
//   authFunction: lambda.Function;
// }

// export class ApiGatewayStack extends cdk.Stack {
//   public readonly api: apigateway.RestApi;

//   constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
//     super(scope, id, props);

//     const { authFunction } = props;

//     // Create the REST API
//     this.api = new apigateway.RestApi(this, 'AdifyApi', {
//       restApiName: API_CONFIG.API_NAME,
//       description: 'Adify API Gateway',
//       defaultCorsPreflightOptions: {
//         allowOrigins: API_CONFIG.CORS_ORIGINS,
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//         allowHeaders: [
//           'Content-Type',
//           'Authorization',
//           'X-Amz-Date',
//           'X-Api-Key',
//           'X-Amz-Security-Token',
//         ],
//       },
//       deployOptions: {
//         stageName: API_CONFIG.STAGE,
//         throttle: {
//           rateLimit: 1000,
//           burstLimit: 2000,
//         },
//       },
//     });

//     // Create Lambda integration
//     const authIntegration = new apigateway.LambdaIntegration(authFunction, {
//       requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
//       proxy: true,
//     });

//     // Create /auth resource
//     const authResource = this.api.root.addResource('auth');

//     // Add signup endpoint: POST /auth/signup
//     const signupResource = authResource.addResource('signup');
//     signupResource.addMethod('POST', authIntegration, {
//       methodResponses: [
//         {
//           statusCode: '201',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '400',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '500',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//       ],
//     });

//     // Add login endpoint: POST /auth/login
//     const loginResource = authResource.addResource('login');
//     loginResource.addMethod('POST', authIntegration, {
//       methodResponses: [
//         {
//           statusCode: '200',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '401',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '500',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//       ],
//     });

//     // Add forgot password endpoint: POST /auth/forgot-password
//     const forgotPasswordResource = authResource.addResource('forgot-password');
//     forgotPasswordResource.addMethod('POST', authIntegration, {
//       methodResponses: [
//         {
//           statusCode: '200',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '400',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//         {
//           statusCode: '500',
//           responseHeaders: {
//             'Access-Control-Allow-Origin': true,
//             'Access-Control-Allow-Headers': true,
//           },
//         },
//       ],
//     });

//     // Grant API Gateway permission to invoke the Lambda function
//     authFunction.grantInvoke(new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'));

//     // Output the API URL
//     new cdk.CfnOutput(this, 'ApiUrl', {
//       value: this.api.url,
//       description: 'URL of the API Gateway',
//       exportName: 'ApiUrl',
//     });

//     // Output individual endpoint URLs for convenience
//     new cdk.CfnOutput(this, 'SignupEndpoint', {
//       value: `${this.api.url}auth/signup`,
//       description: 'Signup endpoint URL',
//     });

//     new cdk.CfnOutput(this, 'LoginEndpoint', {
//       value: `${this.api.url}auth/login`,
//       description: 'Login endpoint URL',
//     });

//     new cdk.CfnOutput(this, 'ForgotPasswordEndpoint', {
//       value: `${this.api.url}auth/forgot-password`,
//       description: 'Forgot password endpoint URL',
//     });
//   }
// }