import { PrincipalPhotoDTO } from "./principal-photo-dto";
import { PublicContentDTO } from "./public-content-dto";

export class FreeAreaDTO {
  id?: number;
  isEnabled?: boolean;
  principalPhotoDTO?: PrincipalPhotoDTO[];
  publicContentDTO?: PublicContentDTO[];
}
