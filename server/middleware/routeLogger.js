const routeLogger = (req, res, next) => {
  const d = new Date();
  const now = `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`
  console.log(`${now} API hit at: ` + req.originalUrl);
  next();
}

module.exports = routeLogger;