const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./counter');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: Number,
  },
  display_name: {
    type: String,
  },
  address: {
    type: String,
    unique: true,
  },
  created_at: {
    type: Number
  },
  updated_at: {
    type: Number
  }
});

UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('user', this, next);
})

const Model = mongoose.model('User', UserSchema);

module.exports = Model;
