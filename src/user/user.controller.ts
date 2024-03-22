import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(@Body() userData: CreateUserDto) {
    try {
      return await this.userService.register(userData);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async loginUser(@Req() req: Request) {
    return req.user;
  }

  @Delete('sessions')
  async logoutUser(@Req() request: Request) {
    const headerValue = request.get('Authorization');
    return await this.userService.logout(headerValue);
  }
}
