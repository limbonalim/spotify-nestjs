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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { AlbumService } from './album.service';
import { AlbumRequest } from './create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: __dirname + '/uploads',
        filename: (req, file, cb) => {
          const randomName = crypto.randomUUID();
          return cb(null, `${randomName}.${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createOne(
    @Body() data: AlbumRequest,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const answer = await this.albumService.createOne({
        title: data.title,
        year: data.year,
        image: file ? `/uploads/artist/${file.filename}` : null,
        artist: data.artist,
      });
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
