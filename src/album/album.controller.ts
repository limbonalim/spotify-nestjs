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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { AlbumService } from './album.service';
import { AlbumRequest } from './create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitGard } from '../auth/permit-auth.guard';
import { Roles } from '../schemas/user.schema';

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

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '/public/uploads/albums'),
        filename: (req, file, cb) => {
          const randomName = crypto.randomUUID();
          return cb(null, `${randomName}${extname(file.originalname)}`);
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
        image: file ? `/uploads/albums/${file.filename}` : null,
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

  @UseGuards(PermitGard(Roles.admin))
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.albumService.deleteOne(id);
  }
}
