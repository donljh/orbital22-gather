const routeLogger = (req, res, next) => {
  console.log('API hit at: ' + req.originalUrl);
  next();
}

module.exports = routeLogger;