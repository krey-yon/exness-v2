import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaSingletonCleint } from "@repo/database";

const JWT_SECRET = "super30";

export async function createUser(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res.send("all fields are required");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prismaSingletonCleint.user.create({
      data: {
        id: Math.floor(Math.random() * 100000),
        username,
        email,
        password: hashedPassword,
        freeBalance: 100,
      },
    });
    if (user) {
      return res.send("user created successfull!!");
    } else {
      throw Error("error creating user");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signInUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email && !password) {
    res.send("both fields are required");
  }

  try {
    const user = await prismaSingletonCleint.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) return res.send("incorrect password");

      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token });
    } else {
      res.send("no user found");
    }
  } catch (error) {
    console.log(error);
  }
}
