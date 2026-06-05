import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Registration function
  async createUser(
    email: string,
    password: string,
    role: string = 'user',
  ): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role: role,
    });
    return await newUser.save();
  }

  // Login function
  async login(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async storeRefreshToken(
    id: Types.ObjectId | string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { refreshToken });
  }

  async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ refreshToken });
  }

  async removeRefreshToken(id: Types.ObjectId | string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } });
  }
}
