export class CreateArtistDto {
  name: string;
  photo: string;
  info: string;
}

export interface ArtistRequest {
  name: string;
  photo: File | null;
  info: string;
}
