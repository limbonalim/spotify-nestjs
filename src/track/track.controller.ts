import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TrackService } from './track.service';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitGard } from '../auth/permit-auth.guard';
import { Roles } from '../schemas/user.schema';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get()
  async getAll(@Query('album') album: string) {
    return this.trackService.getAll(album);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.trackService.getOne(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async createOne(@Body() data: CreateTrackDto, @Res() res: Response) {
    try {
      const answer = await this.trackService.createOne(data);
      return res.status(HttpStatus.CREATED).json(answer);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: error.message, errors: error.errors });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }

  @UseGuards(PermitGard(Roles.admin))
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.trackService.deleteOne(id);
  }
}
