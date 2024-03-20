import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { IsValidObjectId } from './validators/validator';

@Schema()
export class Track {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, ref: 'albums', validate: IsValidObjectId() })
  album: MongooseSchema.Types.ObjectId;
  @Prop({ required: true })
  numberInAlbum: number;
  @Prop({ required: true })
  duration: string;
  @Prop()
  url: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

export type TrackDocument = Track & Document;
