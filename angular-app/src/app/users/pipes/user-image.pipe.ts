import { Pipe, PipeTransform } from '@angular/core';
import { UserDTO } from '../../dto/user-dto';

@Pipe({
  name: 'userImage',
  standalone: true,
})
export class UserImagePipe implements PipeTransform {
  transform(userDTO: UserDTO): string {
    if (!userDTO.id && !userDTO.alt_img) {
      return `assets/images/users/no-image.jpg`;
    }

    if (userDTO.alt_img) return userDTO.alt_img;

    return `assets/images/users/foto${userDTO.id}.jpg`;
  }
}
