const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new UnauthenticatedError("Invalid Token Access Denied.");

  const token = authHeader.split(" ")[1];
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verify.id, name: verify.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticationMiddleWare;
