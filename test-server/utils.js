const bcrypt = require('bcrypt');
const saltRounds = 13;
const tokenKey = process.env.TOKEN_KEY;
const jwt = require('jsonwebtoken');
const users = require('./data').users;

const authenticate = (req, res, next) => {

  let authHeader = req.header('Authorization');
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && typeof token !== 'undefined') {
      const payload = jwt.verify(token, tokenKey);
      req.user = payload;
    } else {
      res.status(400).send({
        error: {
          code: 789,
          message: 'No valid token',
        },
      });
    }
  }
  next();
};

const createToken = (id) => {
  const token = jwt.sign({ _id: id }, tokenKey);
  return token;
};

const findUser = (req, res, next) => {
  let userMatch = users.find((user) => req.body.email === user.email);
  if (userMatch) {
    req.user = userMatch;
    next();
  } else {
    res.status(400).send({
      error: { code: 123, message: 'Either email or password is invalid' },
    });
  }
};

const validPass = async (req, res, next) => {
  let submittedPass = req.body.password;
  let savedPass = req.user.password;
  console.log('comparing', submittedPass, savedPass);
  const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
  if (passwordDidMatch) {
    next();
  } else {
    res
      .status(400)
      .send({ error: { code: 123, message: 'Invalid password or username.' } });
  }
};

const hashPass = async (req, res, next) => {
  let newUser = req.body;
  req.body.hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
  console.log('password has been hashed');
  next();
};

const uniqueEmail = (req, res, next) => {
  let userIndex = users.findIndex((user) => user.email === req.body.email);
  if (userIndex > -1) {
    res
      .status(400)
      .send({ error: { code: 123, message: 'Email address already in use' } });
  } else {
    next();
  }
};

module.exports = {
  authenticate,
  hashPass,
  uniqueEmail,
  createToken,
  findUser,
  validPass,
};
