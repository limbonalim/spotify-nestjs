import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistController } from './artist/artist.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import config from '../config';
import { ArtistService } from './artist/artist.service';
import { AlbumController } from './album/album.controller';
import { AlbumService } from './album/album.service';
import { TrackController } from './track/track.controller';
import { TrackService } from './track/track.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/artist/uploads'),
      serveRoot: '/static',
    }),
    MongooseModule.forRoot(config.mongoose.db),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
  ],
  controllers: [
    AppController,
    ArtistController,
    AlbumController,
    TrackController,
  ],
  providers: [AppService, ArtistService, AlbumService, TrackService],
})
export class AppModule {}
