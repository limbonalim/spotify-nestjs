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
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TrackService } from './track.service';

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

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.trackService.deleteOne(id);
  }
}
