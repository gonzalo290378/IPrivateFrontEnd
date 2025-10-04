import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeAreaService } from '../../services/free-area.service';
import { FreeAreaDTO } from '../../../dto/free-area-dto';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserDTO } from '../../../dto/user-dto';
import { switchMap } from 'rxjs';
import { PublicContentDTO } from '../../../dto/public-content-dto';

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
  publicContentDTO: PublicContentDTO[] = [];
  isEditMode: boolean = false;
  isOwner: boolean = false;
  private baseUrl = `http://localhost:8090/ms-free-area`;

  constructor(
    private freeAreaService: FreeAreaService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;

    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.getEntityByUsername(username)
        )
      )
      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;

        const idFreeArea = user.freeAreaDTO?.id;
        if (idFreeArea !== undefined) {
          this.loadFreeArea(idFreeArea);
          this.freeAreaService.refreshFeed$.subscribe(() => {
            console.log('Detectado nuevo contenido, recargando feed...');
            this.loadFreeArea(idFreeArea);
          });
        }
        return;
      });
  }

  private loadFreeArea(id: number): void {
    this.freeAreaService.findById(id).subscribe((freeArea) => {
      if (freeArea) {
        this.freeArea = freeArea;
        this.publicContentDTO = (freeArea.publicContentDTO || [])
          .map((c: any) => ({
            ...c,
            contentUrl: this.baseUrl + c.contentUrl,
            date:
              c.date ||
              c.createdDate ||
              c.dateCreated ||
              c.timestamp ||
              c.createdAt ||
              c.created ||
              new Date().toISOString(),
          }))
          .sort((a: PublicContentDTO, b: PublicContentDTO) => b.id! - a.id!);
      }
    });
  }

  toggleLike(content: PublicContentDTO): void {
    content.like = (content.like || 0) + 1;
  }
}
