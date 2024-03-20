export class CreateAlbumDto {
  title: string;
  year: number;
  image: string;
  artist: string;
}

export interface AlbumRequest {
  title: string;
  year: number;
  image: File | null;
  artist: string;
}
