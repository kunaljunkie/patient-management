# Project Name
patient-managemnt

## Description
project using various services of AWS using aws sdk: 
- AWS DynamoDB: for storing the patient details and for performing crud operations 
- AWS OpenSearch: storing the patient details and using for fast fetching response 
- AWS Cognito: used of identifying the user, email OTP and user Authentication

## Table of Contents
- [Installation] npm install
- [Usage] CRUD operations 
- [Start_Project] npm start 
- [Structure] MVC, src/
- [Configuration] example .env
- [Contributing] developer
- [License] ------

## Installation
npm install

### Prerequisites
- Node.js (v14 or higher), Express and AWS

## command to run
npm start 

1. Clone the repository:
   ```bash
   git clone https://github.com/kunaljunkie/patient-management.git

#### Serverless Deployements 

Deployment Plan for Patient Management Project to AWS Lambda
1. Prepare the Project for AWS Lambda
Before deployment, adapt your Express app to work in a serverless environment like AWS Lambda.

Express Adapter for AWS Lambda
AWS Lambda doesn't run a traditional Express server. You need to wrap your Express app in a Lambda handler using a library like aws-serverless-express or @vendia/serverless-express.

Install the required package
Modify your app.ts or index.ts to expose the app as a Lambda handler
2. Environment Configuration
Environment Variables
Ensure sensitive information (such as AWS credentials and database configurations) is managed using environment variables.
Use the AWS Lambda environment variable configuration in the AWS Console or by using Terraform/CloudFormation.
Variables you may need:

AWS_REGION
DYNAMODB_TABLE_NAME
COGNITO_USER_POOL_ID
COGNITO_CLIENT_ID
OPENSEARCH_ENDPOINT
For Lambda, set these variables via AWS Console or infrastructure-as-code.

3. API Gateway Setup
Create REST API with API Gateway
Go to the API Gateway service on AWS Console.
Create a new REST API.
Create resources and methods for the Lambda function. You’ll need to define the HTTP methods (GET, POST, PUT, DELETE) that map to your Lambda functions.
Enable CORS for your API endpoints to handle cross-origin requests.
Integrate API Gateway with Lambda
Each route (endpoint) in your Express app should have an associated Lambda function triggered by API Gateway.
You can deploy a single Lambda function for all routes (thanks to Express routing) or create separate functions for each major part of the app (CRUD operations, etc.).
4. DynamoDB Integration
Ensure your Lambda has access to AWS DynamoDB. You'll store patient records in a DynamoDB table.

DynamoDB Table Schema
Table Name: patients_table
Primary Key: patientId (UUID as a String)
Secondary Indexes:
GSI on address for querying patients by address.
GSI on conditions for querying patients by medical condition.
IAM Role for DynamoDB Access
In the AWS Console, create an IAM Role for your Lambda function with the following permissions:

5. AWS OpenSearch Setup
Indexing and Searching
Create an OpenSearch domain, and ensure your Lambda function can access it.
You can use Lambda Layers or npm packages to interact with OpenSearch from within the Lambda function using the OpenSearch SDK.
IAM Role for OpenSearch Access
Ensure your Lambda has access to OpenSearch by attaching policies that allow interaction with your OpenSearch domain.

6. AWS Cognito for Authentication
Create Cognito User Pool
Go to Cognito in the AWS Console.
Create a User Pool to handle user authentication.
Create an App Client for your API to interact with the Cognito User Pool.
Use Cognito JWT tokens to authorize API requests. The token can be passed in the Authorization header of API requests.
Integrating Cognito with API Gateway
In API Gateway, set up the Cognito Authorizer for your API methods.
Require valid tokens for POST, PUT, and DELETE operations, while allowing unauthenticated GET operations.

7. Lambda Deployment
Deploy via AWS SAM/Serverless Framework
Option 1: Using AWS SAM (Serverless Application Model)

Install AWS SAM CLI:
bash
Copy code
brew install aws/tap/aws-sam-cli
Create a template.yaml file to define your Lambda function, API Gateway, and DynamoDB resources.
Use SAM CLI to deploy:
bash
Copy code
sam build
sam deploy --guided

9. Serverless Environment Considerations
IAM Roles and Permissions
Ensure your Lambda execution role has the correct permissions for DynamoDB, OpenSearch, Cognito, and CloudWatch logging.
Resource Limits
AWS Lambda has memory and timeout limits (default is 128 MB and 3 seconds). Configure these based on your workload:
Adjust memory size and timeout based on API requirements in the Lambda settings.
Cold Start
Be aware of cold starts in Lambda, where the first request after a period of inactivity may experience higher latency. You can minimize cold start impact by increasing memory allocation or using Lambda provisioned concurrency.


#### Redis Implementation plan
1. Install Redis and Node.js Redis Client
First, you need to install Redis on your local machine or use a cloud Redis service  Then, install the Redis client for Node.js and TypeScript types:
2. Set Up Redis in Your Application
After installing Redis, you need to connect it to your Node.js application using the Redis client.
3. Create a Caching Middleware
Next, you can create a middleware function that checks if a requested data is cached in Redis. If the data is cached, return it directly from Redis, otherwise proceed to fetch the data from the database, cache it, and return the response.This middleware will check Redis for cached data before continuing with the request. If the data exists in Redis, it serves the cached response, bypassing the need to hit the database.
4. Cache Data After Querying the Database 
Now, modify your route handler to store the response in Redis after querying the database.
5. Testing the Redis Cache
Now, run your application. When you make requests to the /users endpoint:

The first request will fetch data from the database and cache it in Redis.
Subsequent requests within the TTL will serve the data from Redis.