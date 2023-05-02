import { Message, User } from "../model/index.js";

class MessagesMongoDb {
  addMessage = async (messageToAdd) => {
    const message = new Message(messageToAdd);

    await message.save();
  };

  getMessages = async () => {
    const array = {
      id: "1",
      messages: [],
    };

    const messages = await Message.find({});

    messages.forEach((message) => {
      array.messages.push(message);
    });
    return array;
  };
}

class UsersMongoDb {
  addUser = async (userToAdd) => {
    const user = new User(userToAdd);

    await user.save();
    return user;
  };

  getUsers = async () => await User.find({});

  clear = async () => {}; // Not implement for security reasons.
}

export const usersMongoDb = new UsersMongoDb();

export default MessagesMongoDb;
