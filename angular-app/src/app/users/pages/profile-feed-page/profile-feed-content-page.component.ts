import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeAreaService } from '../../services/free-area.service';
import { FreeAreaDTO } from '../../../dto/free-area-dto';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserDTO } from '../../../dto/user-dto';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-feed-content-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-feed-content-page.component.html',
  styleUrls: ['./profile-feed-content-page.component.css'],
})
export class ProfileFeedContentPage implements OnInit {
  freeArea?: FreeAreaDTO;
  user?: UserDTO;
  isEditMode: boolean = false;
  isOwner: boolean = false;

  constructor(
    private freeAreaService: FreeAreaService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  // ngOnInit(): void {
  //   //ACA VA EL METODO QUE LLAMA AL SERVICIO free area y para traer todo el free area
  //   this.loadFreeArea(1);
  // }

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;
    const loggedUsername = this.tokenService.getUsernameFromToken();

    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.getEntityByUsername(username)
        )
      )

      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        const idFreeArea = user.freeAreaDTO?.id;
        if (idFreeArea !== undefined) {
          this.loadFreeArea(idFreeArea);
        }
        return;
      });
  }

  private loadFreeArea(id: number | undefined): void {
    if (id === undefined) {
      console.log('No se proporcionó un id de FreeArea válido');
      return;
    }

    this.freeAreaService.findById(id).subscribe((freeArea) => {
      if (freeArea) {
        console.log(`FreeArea`, freeArea);
        this.freeArea = freeArea;
      } else {
        console.log(`FreeArea con id ${id} no encontrada`);
      }
    });
  }
}
