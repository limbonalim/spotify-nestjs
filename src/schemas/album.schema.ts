import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { IsValidObjectId } from './validators/validator';

@Schema()
export class Album {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  year: number;
  @Prop()
  image: string;
  @Prop({ required: true, ref: 'artists', validate: IsValidObjectId() })
  artist: MongooseSchema.Types.ObjectId;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

export type AlbumDocument = Album & Document;
