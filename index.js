require('app-module-path').addPath(`${__dirname}`);
const mongoose = require('mongoose');
const cfg = require('config');
mongoose.connect(
  `mongodb://${cfg.MONGO_HOST}/${cfg.MONGO_DATABASE}?${cfg.MONGO_OPTIONS}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
    connectTimeoutMS: 30000
  }
  )
.then(() => {
  require('app');
})
.catch((err) => {
  console.log(err)
})
