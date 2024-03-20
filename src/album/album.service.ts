import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumDto } from './create-album.dto';
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>,
  ) {}

  async getAll(artist: string | undefined = undefined) {
    if (artist) {
      const artistId = new Types.ObjectId(artist);

      return this.AlbumModel.find({ artist: artistId }).exec();
    }
    return this.AlbumModel.find().exec();
  }

  async getOne(id: string) {
    return this.AlbumModel.findById(id).exec();
  }

  async createOne(
    albumDto: CreateAlbumDto,
  ): Promise<AlbumDocument | mongoose.Error.ValidationError> {
    return await this.AlbumModel.create({
      title: albumDto.title,
      year: albumDto.year,
      image: albumDto.image,
      artist: albumDto.artist,
    });
  }

  async deleteOne(id: string) {
    return this.AlbumModel.findByIdAndDelete(id).exec();
  }
}
