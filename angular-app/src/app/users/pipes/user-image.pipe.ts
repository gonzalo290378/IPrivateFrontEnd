import { Pipe, PipeTransform } from '@angular/core';
import { UserDTO } from '../../dto/user-dto';

@Pipe({
  name: 'userImage',
  standalone: true,
})
export class UserImagePipe implements PipeTransform {
  private baseUrl = 'http://localhost:8090/ms-free-area';
  
  transform(userDTO: UserDTO): string {
    if (!userDTO?.freeAreaDTO?.principalPhotoDTO?.length) {
      return `${this.baseUrl}/uploads/users/no-image.jpg`;
    }
    const relativeUrl = userDTO.freeAreaDTO.principalPhotoDTO[0].url;
    return `${this.baseUrl}${relativeUrl}`;
  }
}