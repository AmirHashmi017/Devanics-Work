import mongoose from 'mongoose';
import { config } from './config';

mongoose.connect(config.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log(process.env.MONGODB_URI, 'Database Connected successfully');
});

module.exports = db;
