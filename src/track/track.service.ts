import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { Track, TrackDocument } from '../schemas/track.schema';

export class TrackService {
  constructor(
    @InjectModel(Track.name) private TrackModel: Model<TrackDocument>,
  ) {}

  async getAll(album: string | undefined = undefined) {
    if (album) {
      const albumId = new Types.ObjectId(album);
      return this.TrackModel.find({ album: albumId }).exec();
    }
    return this.TrackModel.find().exec();
  }

  async getOne(id: string) {
    return this.TrackModel.findById(id).exec();
  }

  async createOne(
    trackDto: CreateTrackDto,
  ): Promise<TrackDocument | mongoose.Error.ValidationError> {
    return await this.TrackModel.create({
      title: trackDto.title,
      album: trackDto.album,
      numberInAlbum: trackDto.numberInAlbum,
      duration: trackDto.duration,
      url: trackDto.url,
    });
  }

  async deleteOne(id: string) {
    return this.TrackModel.findByIdAndDelete(id).exec();
  }
}
