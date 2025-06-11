 
import { APIGatewayProxyHandler } from 'aws-lambda';
import { routeHandler } from './routes/routes';
import { errorHandler } from './middleware/errorHandler';
 

export const handler: APIGatewayProxyHandler = async (event:any, context:any) => {
  console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
  
  try {
    return await routeHandler(event, context);
  } catch (error) {
    return errorHandler(error as Error, event);
  }
};