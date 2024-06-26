import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user/user.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';
import { TokenAuthGuard } from './auth/token-auth.guard';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoose.db),
    PassportModule,
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    ArtistController,
    AlbumController,
    TrackController,
    UserController,
  ],
  providers: [
    AppService,
    ArtistService,
    AlbumService,
    TrackService,
    UserService,
    AuthService,
    LocalStrategy,
    TokenAuthGuard,
  ],
})
export class AppModule {}
