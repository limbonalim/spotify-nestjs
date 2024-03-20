import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './create-artist.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
  @Get()
  async getAll() {
    return this.artistService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.artistService.getOne(id);
  }

  @Post()
  async createOne(@Body() data: CreateArtistDto, @Res() res: Response) {
    try {
      const answer = await this.artistService.createOne(data);
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
    return this.artistService.deleteOne(id);
  }
}
