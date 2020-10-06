module.exports = (req, res, next) => {
  console.log("ADMIN",req.user.isAdmin);
  if (!req.user.isAdmin) return res.status(403).send("Access Denied");
  next();
};
