import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import socketIo from "socket.io";
// import Item from "./models/Item";
import Chat from "./models/Chat"; // Import model Chat
// import dotenv from "dotenv";
// dotenv.config();
// let URLDB : any = process.env.URL_MONGODB;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "*", // Mengizinkan semua origin, Anda bisa sesuaikan ini
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Aktifkan CORS
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi ke MongoDB
mongoose
  .connect("mongodb+srv://aryejfa:SK33xiaZgTG7k1UO@cluster0.yt21z.mongodb.net/dhumall?authSource=admin")
  .then(() => {
    console.log("FINE");
  })
  .catch(() => {
    console.log("BAD");
  });


// Rute untuk membuat chat baru (POST /chats/upsert)
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

app.post("/chats/upsert", async (req: Request, res: Response) => {
  try {
    const { contacts, newContent } = req.body;

    const existingChats = await Chat.find({});

    let chat  : any = null;

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
});

// Rute untuk menambahkan konten ke dalam chat (POST /chats/:id/content)
app.post("/chats/:id/content", async (req: Request, res: Response) => {
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
});

// Rute untuk menampilkan data sesuai dengan user id pengguna
app.get("/chats/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const chat = await Chat.find({ "contacts.user_id": userId });
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/chats/company/:name", async (req: Request, res: Response) => {
  try {
    const userName = req.params.name;
    const chat = await Chat.find({ "contacts.name": userName });
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/chats", async (_req: Request, res: Response) => {
  try {
    const chat = await Chat.find();
    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/testing-post", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(true);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/testing-get", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(true);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Ketika ada koneksi Socket.io
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Jalankan server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import apiRoutes from "./routes/apiRoutes";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// let URL : any = process.env.URL_MONGODB;

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/", apiRoutes);

// mongoose.connect(URL)
// .then(() => {
//   console.log("FINE");
// })
// .catch(() => {
//   console.log("BAD");
// });

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
