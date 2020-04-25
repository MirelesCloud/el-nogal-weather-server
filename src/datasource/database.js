const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://localhsot:27017/graphqldb';

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connectd to mongo at ${url}`));
