const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./counter');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  _id: {
    type: Number,
  },
  room: String,
  from: String,
  to: String,
  read: {
    type: Boolean,
    default: false
  },
  content: {},
  created_at: Number,
  read_at: Number,
});

MessageSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('message', this, next);
});

const Model = mongoose.model('Message', MessageSchema);

module.exports = Model;
