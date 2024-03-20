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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Get()
  async getAll(@Query('artist') artist: string) {
    return this.albumService.getAll(artist);
  }

  @Get(':id')
  async getOne(@Param() id: string) {
    return this.albumService.getOne(id);
  }

  @Post()
  async createOne(@Body() data: CreateAlbumDto, @Res() res: Response) {
    try {
      const answer = await this.albumService.createOne(data);
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
    return this.albumService.deleteOne(id);
  }
}
