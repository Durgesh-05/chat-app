import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiResponse } from '../utils/apiResponse';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email('Invalid Email Format'),
  password: z.string().min(8, 'Password must be 8 Characters'),
});

const signinSchema = z.object({
  email: z.string().email('Invalid Email Format'),
  password: z.string().min(8, 'Password must be 8 Characters'),
});

const generateToken = (id: string, email: string, name: string) => {
  return jwt.sign({ id, name, email }, String(process.env.JWT_SECRET), {
    expiresIn: '10d',
  });
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signupBody = req.body;
  try {
    const { success, error } = signupSchema.safeParse(signupBody);
    if (!success) {
      res.status(400).json(new ApiResponse(error, 'Invalid Data', 400));
      return;
    }

    const { name, email, password } = signupBody;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res
        .status(409)
        .json(new ApiResponse(null, 'User  Already Registered', 409));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });
    res
      .status(201)
      .json(new ApiResponse(user, 'Registration SuccessFull', 201));
  } catch (e) {
    console.error('Failed to register user ', e);
    res.status(500).json(new ApiResponse(null, 'Something Went Wrong', 500));
    next(e);
  }
};

export const userSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signinBody = req.body;
  try {
    const { success, error } = signinSchema.safeParse(signinBody);
    if (!success) {
      res.status(400).json(new ApiResponse(error, 'Invalid Data', 400));
      return;
    }

    const { email, password } = signinBody;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json(new ApiResponse(null, 'User   Not Found', 404));
      return;
    }

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json(new ApiResponse(null, 'Invalid Credentials', 401));
        return;
      }

      const token = generateToken(user.id, user.email, user.name);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(
        new ApiResponse(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            token: token,
          },
          'Login SuccessFull',
          200
        )
      );
    }
  } catch (e) {
    console.error('Failed to signin user ', e);
    res.status(500).json(new ApiResponse(null, 'Something Went Wrong', 500));
    next(e);
  }
};

export const usersData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id }: any = req.params;
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: id,
        },
      },
      select: {
        name: true,
        email: true,
        id: true,
        chats: true,
        messages: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(users, 'Users Data Fetched Successfully', 200));
  } catch (e) {
    console.error('Failed to Fetch Users Data', e);
    res.status(500).json(new ApiResponse(null, 'Something Went Wrong', 500));
    next(e);
  }
};
