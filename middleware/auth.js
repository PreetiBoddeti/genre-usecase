const jwt = require("jsonwebtoken");
const config = require("config");
 
async function auth(req, res, next) {
  const token = await req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = await jwt.verify(token, config.get("jwtPrivateKey"));
    console.log("private key", config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token");
  }
}

module.exports = auth;
