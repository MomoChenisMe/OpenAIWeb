import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PopovermenuModal } from 'src/app/model/custom';

@Injectable()
export class PopovermenuService {
  private activePopoverSubject$: BehaviorSubject<PopovermenuModal> = new BehaviorSubject<PopovermenuModal>({ id: null });
  activePopover$ = this.activePopoverSubject$.asObservable();

  private createFolderSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  createFolder$ = this.createFolderSubject$.asObservable();

  private renameFolderSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  renameFolder$ = this.renameFolderSubject$.asObservable();

  private deleteFolderSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  deleteFolder$ = this.deleteFolderSubject$.asObservable();

  private createTextSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  createText$ = this.createTextSubject$.asObservable();

  private renameTextSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  renameText$ = this.renameTextSubject$.asObservable();

  private deleteTextSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  deleteText$ = this.deleteTextSubject$.asObservable();

  constructor() { }

  setActivePopover(activeData: PopovermenuModal): void {
    this.activePopoverSubject$.next(activeData);
  }

  setCreateFolder(id: string | null): void {
    this.createFolderSubject$.next(id);
  }

  setRenameFolder(id: string | null): void {
    this.renameFolderSubject$.next(id);
  }

  setDeleteFolder(id: string | null): void {
    this.deleteFolderSubject$.next(id);
  }

  setCreateText(id: string | null): void {
    this.createTextSubject$.next(id);
  }

  setRenameText(id: string | null): void {
    this.renameTextSubject$.next(id);
  }

  setDeleteText(id: string | null): void {
    this.deleteTextSubject$.next(id);
  }
}
