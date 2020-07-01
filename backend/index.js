const app = require('./app');
require('./mongoDB').connect();

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`Server is running on port ${PORT}`));

module.exports = server;