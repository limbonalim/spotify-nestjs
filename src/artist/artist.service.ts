import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';

export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private ArtistModel: Model<ArtistDocument>,
  ) {}

  async getAll() {
    return this.ArtistModel.find().exec();
  }

  async getOne(id: string) {
    return this.ArtistModel.findById(id).exec();
  }

  async createOne(
    artistDto: CreateArtistDto,
  ): Promise<ArtistDocument | mongoose.Error.ValidationError> {
    return await this.ArtistModel.create({
      name: artistDto.name,
      photo: artistDto.photo,
      info: artistDto.info,
    });
  }

  async deleteOne(id: string) {
    return this.ArtistModel.findByIdAndDelete(id).exec();
  }
}
