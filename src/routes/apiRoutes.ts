import { Router } from "express";
const {
  chatsUpsert,
  chatsIdContent,
  chatsId,
  chatsCompanyName,
  chats,
} = require("../controllers/chatController");

const router = Router();

// feature bsm
router.get("chats/upsert", chatsUpsert);
router.get("chats/:id/content", chatsIdContent);
router.get("chats/:id", chatsId);
router.post("chats/company/:name", chatsCompanyName);
router.post("chats", chats);

export default router;