const messageRepo = require('app/repositories/message');

const { assertNotNull } = require('app/utils/validator');

const createMessage = async (data) => {
  assertNotNull(data, 'room');
  assertNotNull(data, 'from');
  assertNotNull(data, 'to');
  assertNotNull(data, 'content');

  const message = await messageRepo.createMessage(data.room, data);

  return message;
}

const getMessages = async (query) => {
  assertNotNull(query, 'room');

  const options = {
    count: query.count ? parseInt(query.count) : 10
  };

  const messages = messageRepo.getMessages(query.room, options);

  return messages;
}

const readMessage = async (id) => {
  const result = messageRepo.updateMessage(id, { read: true });

  return result;
}

module.exports = {
  createMessage,
  getMessages,
  readMessage,
}
