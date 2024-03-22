import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(userData: CreateUserDto) {
    const user = new this.userModel({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });
    user.generateToken();
    return await user.save();
  }

  async logout(headerValue: string) {
    const success = { message: 'success' };
    if (!headerValue) {
      return success;
    }

    const [_, token] = headerValue.split(' ');

    if (!token) {
      return success;
    }

    const user = await this.userModel.findOne({ token });

    if (!user) {
      return success;
    }

    user.generateToken();
    await user.save();
    return success;
  }
}
