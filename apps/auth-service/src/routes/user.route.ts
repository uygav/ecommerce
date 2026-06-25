import { Router } from "express";
import clerkClient from "../utils/clerk";
import { producer } from "../utils/kafka";

const router: Router = Router();

router.get("/", async (req, res) => {
  const users = await clerkClient.users.getUserList();
  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.getUser(id);
  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  try {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser: CreateParams = req.body;
    const user = await clerkClient.users.createUser(newUser);
    await producer.send("user.created", {
      value: {
        username: user.username,
        email: user.emailAddresses[0]?.emailAddress,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Clerk createUser error:", error?.errors || error?.message || error);
    res.status(400).json({ message: error?.errors?.[0]?.message || error?.message || "Failed to create user" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.deleteUser(id);
  res.status(200).json(user);
});

export default router