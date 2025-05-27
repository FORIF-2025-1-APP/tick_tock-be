import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const prisma = new PrismaClient();

const oauth2Client = new OAuth2Client();

// export const register1 = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { email, password, username } = req.body;

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return res.status(400).json({ message: "이미 등록된 이메일입니다." });
//   }

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password,
//       nickname: username,
//     },
//   });

//   const token = generateToken(user.id);

//   return res.json({
//     message: "User created successfully",
//     token,
//     user: {
//       id: user.id,
//       email: user.email,
//       nickname: user.nickname,
//     },
//   });
// };

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: username,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.nickname,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//dummy
export const checkEmail = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(200).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    console.error("Email check error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 로그인 (더미)
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.nickname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ 구글 로그인 (더미)
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { idToken } = req.body;
  try {
    // Set credentials
    oauth2Client.setCredentials({
      access_token: idToken,
    });

    // Get user info from Google People API
    const people = google.people({ version: "v1", auth: oauth2Client });
    const { data } = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    if (!data.emailAddresses?.[0]?.value) {
      return res
        .status(401)
        .json({ message: "Could not get user email from Google" });
    }

    const email = data.emailAddresses[0].value;
    const name = data.names?.[0]?.displayName;
    const picture = data.photos?.[0]?.url;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: email,
          nickname: name || email.split("@")[0],
          //image: picture,
          password: crypto.randomBytes(32).toString("hex"), // Random password for Google users
          //agreed: true
        },
      });
    } else {
      // Update user's information if exists
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          //image: picture || user.image,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.nickname,
        //image: user.image
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 비밀번호 찾기 (더미)
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Send temporary password to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Temporary Password",
      text: `Your temporary password is: ${tempPassword}`,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email sending error:", err);
        return res.status(500).json({ message: "Email sending failed" });
      }
      console.log("Email sent:", info.response);
    });

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
