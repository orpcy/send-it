import jwt from 'jsonwebtoken';

//secret key used in the encoding process. Can be anything
const SECRET_KEY = process.env.SECRET || "stillwhatever";

//using jwt to endcode user information and returning it back as a token so they use it to make requests
export const tokenGenerator = user => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    password: user.password,
    role: user.role
  }, SECRET_KEY, { expiresIn: '1h' });
}

//endpoint to decode token provided by the user and check if to authorize the request or not
export const authorizeUser = (req, res, next) => {
  const token = req.headers.authorization || req.headers['x-access-token'] || req.body.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.send(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: 'Failed',
      message: 'Authentication required for this route'
    });
  }
} 