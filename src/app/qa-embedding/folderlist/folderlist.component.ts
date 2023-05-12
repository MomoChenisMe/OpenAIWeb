import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { CreateFolderFormModel, CreateFolderModal, CreateTextFormModel, CreateTextModal, DeleteFolderModal, DeleteTextModal, ViewNodeModal, RenameModal, RenameFormModel } from 'src/app/model/custom';
import { PopovermenuService } from '../popovermenu/popovermenu.service';
import { delay, filter, Subject, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXPANDEDFOLDERIDS } from 'src/environments/environment';



@Component({
  selector: 'app-folderlist',
  templateUrl: './folderlist.component.html',
  styleUrls: ['./folderlist.component.scss'],
  animations: [
    trigger('folderListRotateIcon', [
      state(
        'collapsed',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('collapsed <=> expanded', [
        animate('150ms ease-in-out'),
      ]),
    ])
  ],
})
export class FolderlistComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() folderData!: ViewNodeModal;
  @Output() createFolderEvent: EventEmitter<CreateFolderModal> = new EventEmitter();
  @Output() renameFolderEvent: EventEmitter<RenameModal> = new EventEmitter();
  @Output() deleteFolderEvent: EventEmitter<DeleteFolderModal> = new EventEmitter();
  @Output() createTextEvent: EventEmitter<CreateTextModal> = new EventEmitter();
  @Output() renameTextEvent: EventEmitter<RenameModal> = new EventEmitter();
  @Output() deleteTextEvent: EventEmitter<DeleteTextModal> = new EventEmitter();
  @Output() openTextEvent: EventEmitter<string> = new EventEmitter();
  @ViewChild('folderNameInputField', { static: false }) folderNameInputField!: ElementRef<HTMLInputElement>;
  private destroy$ = new Subject();

  isCreatedFolder = false;
  isRenamedFolder = false;
  isCreatedText = false;
  renameTextId = '';
  isRenamedText = false;
  isExpanded = false;
  createFolderForm: FormGroup<CreateFolderFormModel>;
  renameForm: FormGroup<RenameFormModel>;
  createTextForm: FormGroup<CreateTextFormModel>;

  constructor(private fb: FormBuilder, private popovermenuService: PopovermenuService,
    private renderer: Renderer2, private el: ElementRef) {
    this.createFolderForm = this.fb.group({
      name: ['', Validators.required],
      parentId: [null]
    }) as FormGroup<CreateFolderFormModel>;

    this.renameForm = this.fb.group({
      id: [''],
      newName: ['', Validators.required]
    });

    this.createTextForm = this.fb.group({
      name: ['', Validators.required],
      folderId: [null],
      textContent: [''],
      textHtml: [''],
    }) as FormGroup<CreateTextFormModel>;
  }

  get activePopover$() {
    return this.popovermenuService.activePopover$;
  }

  ngOnInit(): void {
    if (this.folderData.id === '') {
      this.isCreatedFolder = true;
    }

    this.setInitialExpandedState();
    this.setFlexStyle();

    //目錄新增
    this.popovermenuService.createFolder$.pipe(
      filter(parendId => parendId === this.folderData.id),
      tap(parendId => {
        const indexCount = this.folderData.children.filter(filterItem => filterItem.name.indexOf('新增資料夾') !== -1).length;
        let newName = `新增資料夾${indexCount ? indexCount === 0 ? '' : indexCount.toString() : ''}`;
        if (this.folderData.nodeType === 'root') {
          const rootData = this.folderData.name.split(',');
          newName = `新增資料夾${rootData[0] === '0' ? '' : rootData[0]}`;
        }
        this.createFolderForm.patchValue({
          name: newName,
          parentId: this.folderData.nodeType === 'root' ? null : parendId,
        });
        this.isCreatedFolder = true;
        if (!this.isExpanded) {
          this.onToggleExpansioClick();
        }
      }),
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(parendId => {
      this.setInputFocus();
    });

    //文件新增
    this.popovermenuService.createText$.pipe(
      filter(parendId => parendId === this.folderData.id),
      tap(parendId => {
        const indexCount = this.folderData.children.filter(filterItem => filterItem.nodeType === 'text' && filterItem.name.indexOf('新增文件') !== -1).length;
        let newName = `新增文件${indexCount ? indexCount === 0 ? '' : indexCount.toString() : ''}`;
        if (this.folderData.nodeType === 'root') {
          const rootData = this.folderData.name.split(',');
          newName = `新增文件${rootData[1] === '0' ? '' : rootData[1]}`;
        }
        this.createTextForm.patchValue({
          name: newName,
          folderId: this.folderData.nodeType === 'root' ? null : parendId,
        });
        this.isCreatedText = true;
        if (!this.isExpanded) {
          this.onToggleExpansioClick();
        }
      }),
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(parendId => {
      this.setInputFocus();
    });

    //目錄重新命名
    this.popovermenuService.renameFolder$.pipe(
      filter(result => result === this.folderData.id),
      tap(() => {
        this.renameForm.patchValue({
          id: this.folderData.id,
          newName: this.folderData.name
        });
        this.isRenamedFolder = true
      }),
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.setInputFocus();
    });

    //文件重新命名
    this.popovermenuService.renameText$.pipe(
      filter(result => result === this.folderData.id),
      tap(result => {
        this.renameForm.patchValue({
          id: this.folderData.id,
          newName: this.folderData.name
        });
        this.isRenamedText = true;
      }),
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.setInputFocus();
    });

    //目錄刪除
    this.popovermenuService.deleteFolder$.pipe(
      filter(result => result === this.folderData.id),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.deleteFolderEvent.emit({
        id: this.folderData.id,
        name: this.folderData.name
      });
    });

    //文件刪除
    this.popovermenuService.deleteText$.pipe(
      filter(result => result === this.folderData.id),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.deleteTextEvent.emit({
        id: this.folderData.id,
        name: this.folderData.name
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewInit(): void {
    this.setInputFocus();
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  onToggleExpansioClick(): void {
    if (this.folderData.nodeType === 'folder') {
      this.isExpanded = !this.isExpanded;
      this.updateExpandedStateInLocalStorage();
    } else if (this.folderData.nodeType === 'text') {
      this.openTextEvent.emit(this.folderData.id);
    }
  }

  onNodeRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.popovermenuService.setActivePopover({ id: this.folderData.id, position: { x: event.clientX, y: event.clientY }, menuType: this.folderData.nodeType });
  }

  onCreateFolderSaveClick(): void {
    if (this.createFolderForm.valid) {
      this.isCreatedFolder = false;
      this.popovermenuService.setCreateFolder(null);
      this.createFolderEvent.emit({
        name: this.createFolderForm.value.name!,
        parentId: this.createFolderForm.value.parentId!
      });
    }
  }

  onRenameFolderSaveClick(): void {
    if (this.renameForm.valid) {
      this.isRenamedFolder = false;
      this.popovermenuService.setRenameFolder(null);
      if (this.renameForm.dirty) {
        this.renameFolderEvent.emit({
          id: this.renameForm.value.id!,
          newName: this.renameForm.value.newName!
        });
      }
    }
  }

  onCreateTextSaveClick(): void {
    if (this.createTextForm.valid) {
      this.isCreatedText = false;
      this.popovermenuService.setCreateText(null);
      this.createTextEvent.emit({
        name: this.createTextForm.value.name!,
        folderId: this.createTextForm.value.folderId!,
        textContent: '',
        textHtml: ''
      });
    }
  }

  onRenameTextSaveClick(): void {
    if (this.renameForm.valid) {
      this.isRenamedText = false;
      this.renameTextId = '';
      this.popovermenuService.setRenameText(null);
      if (this.renameForm.dirty) {
        this.renameTextEvent.emit({
          id: this.renameForm.value.id!,
          newName: this.renameForm.value.newName!
        });
      }
    }
  }

  onCreateFolder(createFolderData: CreateFolderModal): void {
    this.createFolderEvent.emit(createFolderData);
  }

  onRenameFolder(renameFolderData: RenameModal) {
    this.renameFolderEvent.emit(renameFolderData);
  }

  onDeleteFolder(deleteFolderData: DeleteFolderModal) {
    this.deleteFolderEvent.emit(deleteFolderData);
  }

  onCreateText(createTextData: CreateTextModal) {
    this.createTextEvent.emit(createTextData);
  }

  onRenameText(renameData: RenameModal) {
    this.renameTextEvent.emit(renameData);
  }

  onDeleteText(deleteTextData: DeleteTextModal) {
    this.deleteTextEvent.emit(deleteTextData);
  }

  onOpenText(textId: string) {
    this.openTextEvent.emit(textId);
  }

  private setInputFocus(): void {
    if (this.folderNameInputField) {
      this.folderNameInputField.nativeElement.focus();
      this.folderNameInputField.nativeElement.select();
    }
  }

  private setFlexStyle(): void {
    if (this.folderData.parentId === 'root' && this.folderData.id === 'root') {
      this.renderer.addClass(this.el.nativeElement, 'flex-1');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'flex-none');
    }
  }

  private setInitialExpandedState(): void {
    const expandedFolderIds = JSON.parse(localStorage.getItem(EXPANDEDFOLDERIDS) || '[]');
    this.isExpanded = expandedFolderIds.includes(this.folderData.id);
  }

  private updateExpandedStateInLocalStorage(): void {
    const expandedFolderIds = JSON.parse(localStorage.getItem(EXPANDEDFOLDERIDS) || '[]');
    if (this.isExpanded && !expandedFolderIds.includes(this.folderData.id)) {
      expandedFolderIds.push(this.folderData.id);
    } else if (!this.isExpanded) {
      const index = expandedFolderIds.indexOf(this.folderData.id);
      if (index > -1) {
        expandedFolderIds.splice(index, 1);
      }
    }
    localStorage.setItem(EXPANDEDFOLDERIDS, JSON.stringify(expandedFolderIds));
  }
}
