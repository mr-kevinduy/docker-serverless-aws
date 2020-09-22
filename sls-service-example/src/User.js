import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Util from './Util';

const usersTable = Util.getTableName('users');

module.exports = {
  /** Create user */
  create: async event => {
    const body = JSON.parse(event.body);

    if (! body.user) return Util.envelop('User must be specified.', 422);

    const user = body.user;

    if (! user.username) return Util.envelop('Usename must be specified.', 422);

    if (! user.email) return Util.envelop('Email must be specified.', 422);

    if (! user.password) return Util.envelop('Password must be specified.', 422);

    // Verify username is not taken.
    const userByUsername = await getUserByUsername(user.username);

    if (userByUsername.Item) return Util.envelop(`Username already taken: [${user.username}]`, 422);

    // Verify email is not taken.
    const userByEmail = await getUserByEmail(user.email);

    if (userByEmail.Count !== 0) return Util.envelop(`Email already taken: [${user.email}]`, 422);

    const encryptedPassword = bcrypt.hashSync(user.password, 5);

    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: {
        username: user.username,
        email: user.email,
        password: encryptedPassword,
      },
    }).promise();

    return Util.envelop({
      user: {
        usename: user.username,
        email: user.email,
        token: mintToken(user.username),
        bio: '',
        image: '',
      }
    });
  },

  /** Get user */
  get: async event => {
    const authenticatedUser = await authenticateAndGetUser(event);
    
    if (! authenticatedUser) {
      return Util.envelop('Token not present or invalid.', 422);
    }

    return Util.envelop({
      user: {
        email: authenticatedUser.email,
        token: getTokenFromEvent(event),
        username: authenticatedUser.username,
        bio: authenticatedUser.bio || '',
        image: authenticatedUser.image || '',
      }
    });
  },

  authenticateAndGetUser: event => {
    try {
      const token = getTokenFromEvent(event);
      const decoded = jwt.verify(token, Util.tokenSecret);
      const username = decoded.username;
      const authenticatedUser = await getUserByUsername(username);

      return authenticatedUser.Item;
    } catch (err) {
      return null;
    }
  },

  getUserByUsername: username => Util.DocumentClient.get({
    TableName: usersTable,
    Key: {
      username
    },
  }).promise(),

  getUserByEmail: email => Util.DocumentClient.query({
    TableName: usersTable,
    IndexName: 'email',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
    Select: 'ALL_ATTRIBUTES'
  }).promise()
};

function mintToken(username) {
  return jwt.sign({ username }, Util.tokenSecret, { expiresIn: '2 days' });
}

function getTokenFromEvent(event) {
  return event.headers.Authorization.replace('Token ', '');
}
