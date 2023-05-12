import {
  CreateFolderModal, CreateTextModal, DeleteFolderModal, DeleteTextModal, ViewNodeModal, HotKeyButtonModel,
  RenameModal, OpenTextModal, StorageTextModal, EditTextFormModel
} from './../model/custom';
import { DialogService } from './../../component/dialog/dialog.service';
import { HttpService } from './../service/http.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subject, switchMap, tap, BehaviorSubject, map, of, filter, Subscription, distinctUntilChanged } from 'rxjs';
import { PopovermenuService } from './popovermenu/popovermenu.service';
import { EXPANDEDFOLDERIDS, SELECTTEXTID, STORAGETEXTLIST } from 'src/environments/environment';
import { MarkdownService } from 'ngx-markdown';
import QABalloonEditor from 'ckeditor5-custom/build/ckeditor5-custom';
import * as Prism from 'prismjs';
import * as Showdown from 'showdown';


// const REGEX = /[^A-Za-z0-9\u4e00-\u9fa5，。！？、,!¡?¿.]/g;
// const REGEX = /[^A-Za-z0-9\u4e00-\u9fa5，。！？、,!¡?¿.\[\](){}\[\]（）｛｝]/g;

@Component({
  selector: 'app-qa-embedding',
  templateUrl: './qa-embedding.component.html',
  styleUrls: ['./qa-embedding.component.scss']
})
export class QaEmbeddingComponent implements OnInit, OnDestroy {
  private showDownConverter: Showdown.Converter;

  private editorInstance!: QABalloonEditor;
  private subscribtion: Subscription = new Subscription();
  private destroy$ = new Subject();
  private loadTextSubject$ = new BehaviorSubject<string>('');
  private tokenSizeSubject$ = new BehaviorSubject<number>(0);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private getAllFolders$ = this.httpService.get<ViewNodeModal[]>('/TextManagement/GetAllFolders').pipe(
    map(result => {
      return this.folderData = result;
    }),
    tap(() => {

      // const selectTextId = localStorage.getItem(SELECTTEXTID) || '';
      // if (!this.checkFolderExists(selectTextId, this.folderData)) {
      //   console.log('not exist')
      //   localStorage.removeItem(SELECTTEXTID);
      // }

      const expandedFolderIds = JSON.parse(localStorage.getItem(EXPANDEDFOLDERIDS) || '[]');
      const updatedExpandedFolderIds = expandedFolderIds.filter((id: string) => this.checkFolderExists(id, this.folderData));
      localStorage.setItem(EXPANDEDFOLDERIDS, JSON.stringify(updatedExpandedFolderIds));

      const folderIndexCount = this.folderData.filter(filterItem => filterItem.name.indexOf('新增資料夾') !== -1).length;
      const textIndexCount = this.folderData.filter(filterItem => filterItem.name.indexOf('新增文件') !== -1).length;
      this.folderData.push({
        id: 'root',
        name: `${folderIndexCount},${textIndexCount}`,
        parentId: 'root',
        nodeType: 'root',
        children: []
      });
    }),
    // tap(() => console.log(this.folderData))
  );

  loadText$ = this.loadTextSubject$.asObservable();
  loadTextData$ = this.loadTextSubject$.pipe(
    filter(textId => textId !== ''),
    switchMap(textId => this.httpService.get<OpenTextModal>(`/TextManagement/GetText/${textId}`)),
    tap(textData => {
      this.initOpenTextForm(textData);
    }),
    tap(textData => {
      const existTextData = this.storageTextData.find(findItem => findItem.id === textData.id);
      if (!existTextData) {
        this.setStorageTextList(textData);
      }
      this.setSelectedTextId(textData.id);
    }),
    switchMap((textData: any) => this.httpService.post('/OpenAI/GPT3Tokenizer', { text: textData.textContent }).pipe(
      tap((resultSize: any) => this.tokenSizeSubject$.next(resultSize.tokens)),
      map(() => textData)
    )),
  );

  selectedTextId: string | null = null;
  folderData: ViewNodeModal[] = [];
  storageTextData: StorageTextModal[] = [];
  loading$ = this.loadingSubject$.asObservable();
  tokenSize$ = this.tokenSizeSubject$.asObservable();
  // aiRobotSystemPrompt = `From now on, you can only answer text editing, document processing, and Chinese to English translation-related questions as accurately as possible based on the provided context. For all other questions, please answer with '抱歉,我無法執行文字編輯、文書處理和中翻英以外的工作'. If the provided context is irrelevant to the question, please answer with '抱歉,您的提問和文本無關聯'.`;
  // aiRobotSystemPrompt = `From now on, use Traditional Chinese, you can only introduce yourself or answer questions related to text editing, document processing, text formatting, and Chinese-to-English translation as accurately as possible based on the context I provide. For all other questions, please answer '抱歉,我無法執行文字編輯、文書處理和中翻英以外的工作'. If the provided context is irrelevant to the question, please answer '抱歉,您的提問和文本無關聯'.`;
  aiRobotSystemPrompt = `從現在開始請你使用繁體中文並且你只能使用我提供的上下文進行句子、文本或文件的整理、排版、編輯、中翻英的工作，對於其它要求請回答"抱歉,我無法執行文字編輯、文書處理和中翻英以外的工作"。`;
  aiRobotHotKeyButtonList: HotKeyButtonModel[] = [
    {
      name: '文本重整',
      icon: 'matSubjectRound',
      hotKey: '建立標題,將文本整理後依據內容自行拆分成數個項目或段落並搭配Markdown語法'
    },
    {
      name: '文本分段',
      icon: 'matContentCutRound',
      hotKey: '把文本分段適當的加入項目或段落'
    },
    {
      name: '摘要截取',
      icon: 'matImportContactsRound',
      hotKey: '給我摘要'
    },
    {
      name: '翻譯英文',
      icon: 'matTranslateRound',
      hotKey: '翻譯成英文'
    }
  ];
  // embeddingForm: FormGroup<EmbeddingFormModel>;
  openTextForm: FormGroup<EditTextFormModel>;
  public Editor = QABalloonEditor;

  constructor(private httpService: HttpService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private popovermenuService: PopovermenuService) {
    // this.embeddingForm = this.fb.group({
    //   text: ['', Validators.required],
    // });
    this.showDownConverter = new Showdown.Converter();

    this.openTextForm = this.fb.group({
      id: [''],
      textHtml: [''],
    });
  }

  formatTextData = '';

  ngOnInit(): void {

    const storedTextData = localStorage.getItem(STORAGETEXTLIST);
    if (storedTextData) {
      this.storageTextData = JSON.parse(storedTextData);
    }

    this.getCurrentTextAndLoad();

    this.getAllFolders$.subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  onCkEditorReady(editor: any) {
    this.editorInstance = editor;
  }

  onFolderMenuRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.popovermenuService.setActivePopover({ id: null, position: { x: event.clientX, y: event.clientY } });
  }

  onAIRobotTipClick(newContent: string) {
    this.dialogService.confirmDialog({ content: '確定要選擇這個答案作為新的文本嗎?' }).subscribe(result => {
      if (result) {
        //這裡無法使用patchValue否則Ckeditor會重置undo redo的記憶
        // this.openTextForm.patchValue({
        //   textHtml: this.markdownService.parse(newContent)
        // });
        this.setCkeditorDataWithUndo(newContent);
      }
    });
  }

  onCreateFolder(createFolderData: CreateFolderModal) {
    this.httpService.post('/TextManagement/CreateFolder', createFolderData).pipe(
      switchMap(() => this.getAllFolders$)
    ).subscribe();
  }

  onRenameFolder(renameData: RenameModal) {
    this.httpService.patch(`/TextManagement/RenameFolder/${renameData.id}`, renameData).pipe(
      switchMap(() => this.getAllFolders$)
    ).subscribe();
  }

  onDeleteFolder(deleteFolderData: DeleteFolderModal) {
    this.dialogService.confirmDialog({ content: `此操作會連同子資料夾和文件一併刪除,確定要刪除資料夾: ${deleteFolderData.name} 嗎?` }).pipe(
      switchMap(result => {
        if (result) {
          return this.httpService.delete(`/TextManagement/DeleteFolder/${deleteFolderData.id}`).pipe(
            switchMap(result => this.getAllFolders$)
          );
        }
        return of(result);
      })
    ).subscribe();
  }

  onCreateText(createTextData: CreateTextModal) {
    this.httpService.post('/TextManagement/CreateText', createTextData).pipe(
      switchMap(() => this.getAllFolders$)
    ).subscribe();
  }

  onRenameText(renameData: RenameModal) {
    this.httpService.patch(`/TextManagement/RenameText/${renameData.id}`, renameData).pipe(
      switchMap(() => this.getAllFolders$)
    ).subscribe();
  }

  onDeleteText(deleteTextData: DeleteTextModal) {
    this.dialogService.confirmDialog({ content: `確定要刪除文件: ${deleteTextData.name} 嗎?` }).pipe(
      switchMap(result => {
        if (result) {
          return this.httpService.delete(`/TextManagement/DeleteText/${deleteTextData.id}`).pipe(
            switchMap(result => this.getAllFolders$)
          );
        }
        return of(result);
      })
    ).subscribe();
  }

  onOpenText(textId: string) {
    this.loadTextSubject$.next(textId);
  }

  selectTab(textId: string): void {
    this.loadTextSubject$.next(textId);
  }

  onCloseText(textId: string) {
    const index = this.storageTextData.findIndex(textData => textData.id === textId);

    if (index !== -1) {
      this.storageTextData.splice(index, 1);
      localStorage.setItem(STORAGETEXTLIST, JSON.stringify(this.storageTextData));
      this.loadNextText(index);
    }
    if (this.storageTextData.length === 0) {
      this.loadTextSubject$.next('');
      this.setSelectedTextId('');
    }
  }

  onTextSaveClick() {
    if (this.openTextForm.valid) {
      this.loadingSubject$.next(true);
      this.httpService.patch(`/TextManagement/UpdateText/${this.openTextForm.value.id}`, {
        textContent: this.showDownConverter.makeMarkdown(this.openTextForm.value.textHtml!),
        textHtml: this.openTextForm.value.textHtml!
      }).pipe(
        tap(() => {
          this.getCurrentTextAndLoad();
        }),
        tap(result => this.loadingSubject$.next(false)),
        switchMap(result => this.dialogService.informationDialog({ content: '訓練文本儲存完成' }))
      ).subscribe();
    }
  }

  onTextReloadClick() {
    this.getCurrentTextAndLoad();
  }

  private setSelectedTextId(textId: string) {
    this.selectedTextId = textId;
    localStorage.setItem(SELECTTEXTID, textId);
  }

  private setStorageTextList(textData: StorageTextModal) {
    const existTextData = this.storageTextData.find(findItem => findItem.id === textData.id);
    if (!existTextData) {
      this.storageTextData.push(textData);
      localStorage.setItem(STORAGETEXTLIST, JSON.stringify(this.storageTextData));
    }
  }

  private checkFolderExists(id: string, folders: ViewNodeModal[]): boolean {
    for (const folder of folders) {
      if (folder.id === id) {
        return true;
      } else if (this.checkFolderExists(id, folder.children)) {
        return true;
      }
    }
    return false;
  }

  private loadNextText(index: number): void {
    const newIndex = index === 0 ? 0 : index - 1;
    const nextData = this.storageTextData.at(newIndex);

    if (nextData) {
      this.loadTextSubject$.next(nextData.id);
    }
  }

  private getCurrentTextAndLoad() {
    const storedSelectedTextId = localStorage.getItem(SELECTTEXTID);
    if (storedSelectedTextId) {
      this.selectedTextId = storedSelectedTextId;
      this.loadTextSubject$.next(this.selectedTextId);
    }
  }

  private initOpenTextForm(textData: OpenTextModal): void {
    this.openTextForm.patchValue({
      id: textData.id,
      textHtml: textData.textHtml
    });
    this.formatTextData = textData.textContent;
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
    this.subscribtion = this.openTextForm.controls.textHtml.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((textContent: any) => this.showDownConverter.makeMarkdown(textContent)),
      tap(textContent => this.formatTextData = textContent),
      switchMap((textContent: any) => this.httpService.post('/OpenAI/GPT3Tokenizer', { text: textContent }).pipe(
        tap((resultSize: any) => this.tokenSizeSubject$.next(resultSize.tokens)),
        map(() => textContent)
      )),
    ).subscribe();
  }

  private setCkeditorDataWithUndo(newContent: string) {
    this.editorInstance.model.change((writer: any) => {
      const rootElement = this.editorInstance.model.document.getRoot();
      const startPosition = writer.createPositionAt(rootElement, 0);
      const endPosition = writer.createPositionAt(rootElement, 'end');
      const range = writer.createRange(startPosition, endPosition);
      const selection = this.editorInstance.model.document.selection;
      writer.setSelection(range);
      this.editorInstance.model.deleteContent(selection);
      const view = this.editorInstance.data.processor.toView(this.showDownConverter.makeHtml(newContent));
      const model = this.editorInstance.data.toModel(view);
      this.editorInstance.model.insertContent(model, this.editorInstance.model.document.selection);
    });
  }
}

