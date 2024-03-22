import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async registerUser(@Body() userData: CreateUserDto) {
    try {
      const user = new this.userModel({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
      });
      user.generateToken();
      return await user.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }
      throw error;
    }
  }
}
