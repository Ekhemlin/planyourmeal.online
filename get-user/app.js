// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {

  const documentClient = new AWS.DynamoDB.DocumentClient();

  var getUser = {
    TableName: 'Users',
    Key: {
      "id": event['queryStringParameters']['id']
    },
    ProjectionExpression: "inventory,firstName,lastName,macros"
  };

  try {
    // Utilising the put method to insert an item into the table (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01)
    const getUserData = await documentClient.get(getUser).promise();
    if(!getUserData.hasOwnProperty(["Item"])){
      var response = {
        statusCode: 509,
        body: `user \'${body["id"]}\' not found`
      };
      return response;
    }
    var user = getUserData["Item"];

    var response = {
      body: JSON.stringify({ "user": user }),
      statusCode: 200
    };
    return response; // Returning a 200 if the item has been inserted
  }
  catch (e) {
    let response = {
      statusCode: 500,
      body: JSON.stringify(e)
    };
    return response;
  }
};

