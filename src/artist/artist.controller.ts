import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArtistService } from './artist.service';
import { ArtistRequest, CreateArtistDto } from './create-artist.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitGard } from '../auth/permit-auth.guard';
import { Roles } from '../schemas/user.schema';

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

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '/public/uploads/artists'),
        filename: (req, file, cb) => {
          const randomName = crypto.randomUUID();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createOne(
    @Body() data: ArtistRequest,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const dataForSave: CreateArtistDto = {
        name: data.name,
        info: data.info,
        photo: file ? `/uploads/artists/${file.filename}` : null,
      };
      const answer = await this.artistService.createOne(dataForSave);
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
    return this.artistService.deleteOne(id);
  }
}
