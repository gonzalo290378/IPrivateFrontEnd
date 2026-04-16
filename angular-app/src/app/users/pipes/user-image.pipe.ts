import { Pipe, PipeTransform } from '@angular/core';
import { UserDTO } from '../../dto/user-dto';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'userImage',
  standalone: true,
})
export class UserImagePipe implements PipeTransform {
  private baseUrl = environment.msFreeArea;
  
  transform(userDTO: UserDTO): string {
    if (!userDTO?.freeAreaDTO?.principalPhotoDTO?.length) {
      return `${this.baseUrl}/uploads/users/no-image.jpg`;
    }
    const relativeUrl = userDTO.freeAreaDTO.principalPhotoDTO[0].url;
    return `${this.baseUrl}${relativeUrl}`;
  }
}