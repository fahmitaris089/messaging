import { Request, Response } from "express";
import axios from "axios";
axios.defaults.timeout = 1000 * 180;
import socketIo from "socket.io";
import Item from "../models/Item";
import Chat from "../models/Chat";
import http from "http";

const server = http.createServer();
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function areContactsEqual(contacts1: any[], contacts2: any[]): boolean {
  if (contacts1.length !== contacts2.length) return false;

  const contactMap = new Map();

  contacts1.forEach((contact) => {
    contactMap.set(`${contact.user_id}-${contact.type}`, true);
  });

  for (const contact of contacts2) {
    if (!contactMap.has(`${contact.user_id}-${contact.type}`)) {
      return false;
    }
  }

  return true;
}
export const chatsUpsert = async (req: Request, res: Response) => {
  try {
    const { contacts, newContent } = req.body;

    const existingChats: any = await Chat.find({});

    let chat: any = null;

    for (const existingChat of existingChats) {
      if (areContactsEqual(existingChat.contacts, contacts)) {
        chat = await Chat.findOneAndUpdate(
          { _id: existingChat._id },
          { $push: { content: newContent } },
          { new: true, useFindAndModify: false }
        );

        io.emit("chatUpdated", chat);
        return res.status(200).json(chat);
      }
    }

    chat = new Chat(req.body);
    await chat.save();

    chat = await Chat.findOneAndUpdate(
      { _id: chat._id },
      { $push: { content: newContent } },
      { new: true, useFindAndModify: false }
    );

    io.emit("chatCreated", chat);
    return res.status(201).json(chat);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const chatsIdContent = async (req: Request, res: Response) => {
  const chatId = req.params.id;
  const newContent = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { content: newContent } },
      { new: true, useFindAndModify: false }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    io.emit("contentAdded", chat);

    res.status(200).json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const chatsId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const chat = await Chat.find({ "contacts.user_id": userId });
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const chatsCompanyName = async (req: Request, res: Response) => {
  try {
    const userName = req.params.name;
    const chat = await Chat.find({ "contacts.name": userName });
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const chats = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.find();
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
