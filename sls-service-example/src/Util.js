import AWS from 'aws-sdk';

/* istanbul ignore next */
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'ap-southeast-1';
}

/* istanbul ignore next */
if (!process.env.DYNAMODB_NAMESPACE) {
  process.env.DYNAMODB_NAMESPACE = 'dev';
}

// In offline mode, use DynamoDB local server
let DocumentClient = null;

/* istanbul ignore next */
if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: 'localhost',
    endpoint: "http://localhost:8000"
  });
}

DocumentClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  ping: async () => {
    return envelop({
      pong: new Date(),
      AWS_REGION: process.env.AWS_REGION,
      DYNAMODB_NAMESPACE: process.env.DYNAMODB_NAMESPACE,
    });
  },

  getTableName: name => `${process.env.DYNAMODB_NAMESPACE}-${name}`,

  DocumentClient,

  envelop,

  tokenSecret: process.env.SECRET ? process.env.SECRET : '3ee058420bc2',
};

function envelop(res, statusCode = 200) {
  let body;

  if (statusCode == 200) {
    body = JSON.stringify(res, null, 2);
  } else {
    body = JSON.stringify({ errors: { body: [res] } }, null, 2);
  }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body,
  };
}
