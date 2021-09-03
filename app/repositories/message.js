const Model = require('app/models/message');

const createMessage = async (room, data) => {
  const currTime = Date.now();

  const doc = await Model.create({
    room: room,
    from: data.from,
    to: data.to,
    created_at: currTime,
  });

  return { created_at: currTime, message_id: doc._id }
}

const updateMessage = async (id, data) => {
  const result = await Model.findOneAndUpdate(
    {
      _id: id
    },
    {
      $set: data
    }
  ).exec();

  return result != null ? 1 : 0;
}

const getMessages = async (room, options) => {
  const messages = await Model.find(
    {
      room: room
    },
    {
      from: 1,
      to: 1,
      content: 1,
      read: 1,
      created_at: 1
    }
  );

  return messages ? messages._doc : user;
}

module.exports = {
  createMessage,
  updateMessage,
  getMessages,
}
