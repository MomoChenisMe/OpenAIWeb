import { Component, OnInit } from '@angular/core';
import { PopovermenuService } from './popovermenu.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PopovermenuType } from 'src/app/model/custom';

@Component({
  selector: 'app-popovermenu',
  templateUrl: './popovermenu.component.html',
  styleUrls: ['./popovermenu.component.scss'],
  animations: [
    trigger('folderListPopoverAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)',
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)',
      })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.2s ease-in-out')
      ]),
      transition('* => void', [
        animate('0.2s ease-in-out')
      ])
    ])
  ],
})
export class PopovermenuComponent implements OnInit {
  private activePopoverId: string | null = '';
  menuType: PopovermenuType = 'folder';
  popoverPosition = { x: 0, y: 0 };
  showPopover = false;

  constructor(private popovermenuService: PopovermenuService) { }

  ngOnInit(): void {
    this.subscribeToActivePopover();
  }

  subscribeToActivePopover(): void {
    this.popovermenuService.activePopover$.subscribe(activePopover => {
      this.activePopoverId = activePopover.id;
      this.showPopover = activePopover.position !== undefined;
      if (activePopover.position) {
        this.popoverPosition = activePopover.position;
      }
      if (activePopover.menuType) {
        this.menuType = activePopover.menuType;
      }
    });
  }

  onCreateFolderClick(): void {
    this.popovermenuService.setCreateFolder(this.activePopoverId);
    this.popovermenuService.setActivePopover({ id: null });
  }

  onCreateTextClick(): void {
    this.popovermenuService.setCreateText(this.activePopoverId);
    this.popovermenuService.setActivePopover({ id: null });
  }

  onRenameClick(): void {
    if (this.menuType === 'folder') {
      this.popovermenuService.setRenameFolder(this.activePopoverId);
    }
    if (this.menuType === 'text') {
      this.popovermenuService.setRenameText(this.activePopoverId);
    }
    this.popovermenuService.setActivePopover({ id: null });
  }

  onDeleteClick(): void {
    if (this.menuType === 'folder') {
      this.popovermenuService.setDeleteFolder(this.activePopoverId);
    }
    if (this.menuType === 'text') {
      this.popovermenuService.setDeleteText(this.activePopoverId);
    }

    this.popovermenuService.setActivePopover({ id: null });
  }

  onPopoverMenuClick(): void {
    this.popovermenuService.setActivePopover({ id: null });
  }

  onPopoverMenuBackgroundClick(): void {
    this.popovermenuService.setActivePopover({ id: null });
  }
}
