import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FreeAreaDTO } from '../../../../dto/free-area-dto';
import { PublicContentDTO } from '../../../../dto/public-content-dto';
import { UserDTO } from '../../../../dto/user-dto';
import { FreeAreaService } from '../../../services/free-area.service';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-feed-content-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile-feed-content-page.component.html',
  styleUrls: ['./profile-feed-content-page.component.css'],
})
export class ProfileFeedContentPage implements OnInit {
  freeArea?: FreeAreaDTO;
  user?: UserDTO;
  publicContentDTO: PublicContentDTO[] = [];
  isEditMode: boolean = false;
  isOwner: boolean = false;
  openMenuId: number | null = null;
  selectedContent?: PublicContentDTO;
  isEditingDescription: boolean = false;
  editedDescription: string = '';
  showShareTooltip: boolean = false;
  private baseUrl = environment.msFreeArea;

  constructor(
    private freeAreaService: FreeAreaService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    const isEditUrl = this.router.url.startsWith('/edit/');
    this.isEditMode = isEditUrl;

    this.activatedRoute.params
      .pipe(
        switchMap(({ username }) =>
          this.userService.getEntityByUsername(username),
        ),
      )
      .subscribe((user) => {
        if (!user) return this.router.navigate(['/']);
        this.user = user;

        const currentUsername = this.tokenService.getUsernameFromToken();
        this.isOwner = currentUsername === user.username;

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
          .filter((c: any) => c.isEnabled === true)
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

  toggleMenu(contentId: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === contentId ? null : contentId;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  startEditDescription(): void {
    if (!this.selectedContent) return;
    this.editedDescription = this.selectedContent.description || '';
    this.isEditingDescription = true;
    this.closeMenu();
  }

  cancelEdit(): void {
    this.isEditingDescription = false;
    this.editedDescription = '';
  }

  saveDescription(): void {
    if (!this.selectedContent || !this.user?.freeAreaDTO?.id) return;

    const freeAreaId = this.user.freeAreaDTO.id;
    const contentId = this.selectedContent.id!;

    console.log('que hay en freeAreaId y en contentId', freeAreaId, contentId);
    console.log('actual description', this.editedDescription);

    this.freeAreaService
      .updatePublicContent(freeAreaId, contentId, this.editedDescription)
      .subscribe((updatedContent) => {
        if (updatedContent) {
          this.selectedContent!.description = updatedContent.description;
          this.isEditingDescription = false;
        } else {
          console.error('Error al actualizar la descripción');
        }
      });
  }

  shareContent(content: PublicContentDTO): void {
    const shareUrl = `${window.location.origin}/${this.user?.username}/${this.user?.id}/content/${content.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Publicación de ${this.user?.username}`,
          text: content.description || 'Mira esta publicación',
          url: shareUrl,
        })
        .catch((err) => console.log('Error al compartir:', err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.showShareTooltip = true;
        setTimeout(() => {
          this.showShareTooltip = false;
        }, 2000);
      });
    }

    this.closeMenu();
  }

  startEditFromMenu(content: PublicContentDTO) {
    this.selectedContent = content;
    this.editedDescription = content.description || '';
    this.isEditingDescription = true;
    this.closeMenu();
  }

  deleteContent(content: PublicContentDTO): void {
    if (!this.user?.freeAreaDTO?.id) return;

    const freeAreaId = this.user.freeAreaDTO.id;
    const contentId = content.id!;

    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?'))
      return;

    this.freeAreaService.deletePublicContent(freeAreaId, contentId).subscribe({
      next: () => {
        this.publicContentDTO = this.publicContentDTO.filter(
          (c) => c.id !== contentId,
        );
        this.closeMenu();
      },
      error: (err) => console.error('Error al eliminar la publicación', err),
    });
  }
}
