import { AuthService } from './../service/auth.service';
import { DialogService } from './../../component/dialog/dialog.service';
import { BehaviorSubject, Subject, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { ChatGPTFormModel, ChatGPTModel, ChatRoomModal } from '../model/custom';
import { HttpService } from './../service/http.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenPayloadModel } from '../model/auth';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss']
})
export class ChatgptComponent implements OnInit {
  @ViewChild('chatGPTContentDiv', { static: false }) chatGPTContentDiv!: ElementRef<HTMLElement>;

  private accountEmail = '';
  private scrollButtonSubject$ = new BehaviorSubject<boolean>(false);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();
  scrollButton$ = this.scrollButtonSubject$.asObservable().pipe(distinctUntilChanged());

  chatRoomData: ChatRoomModal[] = [];
  currentChatRoomID = '';
  chatGPTForm: FormGroup<ChatGPTFormModel>;

  constructor(private httpService: HttpService, private fb: FormBuilder,
    private authService: AuthService,
    private dialogService: DialogService) {
    this.chatGPTForm = this.fb.group({
      role: ['user', Validators.required],
      content: ['', Validators.required],
    });
  }

  get show(): number {
    return window.innerWidth;
  }

  get UserPicture(): string | undefined {
    return this.authService.tokenInfo?.picture;
  }

  get tokenInfo(): TokenPayloadModel | undefined {
    return this.authService.tokenInfo;
  }

  onShowHamburger(): boolean {
    return window.innerWidth <= 1024
  }

  ngOnInit(): void {
    this.fetchChatRooms();
  }

  onMessageSendClick(): void {
    if (this.chatGPTForm.valid && this.currentCharRoomContent) {
      this.sendChatMessage();
    }
  }

  onNewChatClick(): void {
    this.createNewChatRoom();
  }

  onChatroomClick(newChatroomID: string): void {
    this.switchChatRoom(newChatroomID);
  }

  onChatroomDeleteClick(chatroomID: string): void {
    this.deleteChatRoom(chatroomID);
  }

  onChatroomEditSaveClick() {
    this.loadingSubject$.next(true);
    this.updateChatRoom();
  }

  onExampleClick(exampleString: string): void {
    this.sendExampleMessage(exampleString);
  }

  onChatGPTContentScroll(event: any): void {
    this.toggleScrollButton(event);
  }

  onScrollToBottomClick(): void {
    this.scrollToBottom();
  }

  private fetchChatRooms(): void {
    this.loadingSubject$.next(true);
    this.httpService.get<ChatRoomModal[]>(`/Chatroom/${this.tokenInfo?.email}`).subscribe(result => {
      this.chatRoomData = result;
      this.currentChatRoomID = this.currentChatroomFromLocalStorage || '';
      this.loadingSubject$.next(false);
    });
  }

  private sendChatMessage(): void {
    this.loadingSubject$.next(true);
    let chatRoomContent = this.currentCharRoomContent!;
    chatRoomContent.push({ role: this.chatGPTForm.value.role!, content: this.chatGPTForm.value.content! });
    this.resetForm();

    setTimeout(() => {
      this.scrollToBottom();
    });

    this.httpService.openAIAPIPost('/OpenAI/ChatGPTStream', chatRoomContent).subscribe({
      next: result => {
        this.updateAssistantMessage(result.text);
      },
      complete: () => {
        if (this.currentCharRoom) {
          this.updateChatRoom();
        }
      },
    });
  }

  private createNewChatRoom(): void {
    this.chatRoomData.push({
      chatroomID: '',
      chatName: '',
      content: []
    });
    this.currentChatRoomID = '';
  }

  private switchChatRoom(newChatroomID: string): void {
    this.currentChatRoomID = newChatroomID;
    this.saveCurrentChatroomToLocalStorage(this.currentChatRoomID);
  }

  private deleteChatRoom(chatroomID: string): void {
    this.loadingSubject$.next(true);
    this.httpService.delete(`/Chatroom/${this.tokenInfo?.email}/${chatroomID}`).pipe(
      switchMap(() =>
        this.httpService.get<ChatRoomModal[]>(`/Chatroom/${this.tokenInfo?.email}`).pipe(
          tap(result => {
            this.chatRoomData = result;
          })
        )
      ),
    ).subscribe(() => {
      this.currentChatRoomID = '';
      this.removeCurrentChatroomFromLocalStorage();
      this.loadingSubject$.next(false);
    });
  }

  private sendExampleMessage(exampleString: string): void {
    this.chatGPTForm.patchValue({
      content: exampleString
    });
    this.onMessageSendClick();
  }

  private toggleScrollButton(event: any): void {
    const target = event.target;
    const isAtBottom = target.scrollTop <= -300;
    if (isAtBottom) {
      this.scrollButtonSubject$.next(true);
    } else {
      this.scrollButtonSubject$.next(false);
    }
  }

  private scrollToBottom(): void {
    this.chatGPTContentDiv.nativeElement.scrollTo({
      top: this.chatGPTContentDiv.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  private resetForm(): void {
    this.chatGPTForm.reset({
      role: 'user',
      content: ''
    });
  }

  private updateAssistantMessage(text: string): void {
    let chatRoomContent = this.currentCharRoomContent!;
    if (chatRoomContent[chatRoomContent.length - 1].role === 'user') {
      chatRoomContent.push({ role: 'assistant', content: '' });
    }
    let data = chatRoomContent[chatRoomContent.length - 1];
    data.content += text;
    chatRoomContent[chatRoomContent.length - 1] = data;
  }

  private updateChatRoom(): void {
    this.httpService.put(`/Chatroom/${this.tokenInfo?.email}`, this.currentCharRoom).pipe(
      switchMap((upsertResult: any) =>
        this.httpService.get<ChatRoomModal[]>(`/Chatroom/${this.tokenInfo?.email}`).pipe(
          tap(result => {
            this.chatRoomData = result;
            this.currentChatRoomID = upsertResult.chatroomID;
            this.saveCurrentChatroomToLocalStorage(this.currentChatRoomID);
            this.loadingSubject$.next(false);
          })
        )
      ),
    ).subscribe();
  }

  private saveCurrentChatroomToLocalStorage(data: string): void {
    window.localStorage.setItem('currentChatroom', data);
  }

  private removeCurrentChatroomFromLocalStorage(): void {
    window.localStorage.removeItem('currentChatroom');
  }

  get currentCharRoom(): ChatRoomModal | undefined {
    return this.chatRoomData.find(findData => findData.chatroomID === this.currentChatRoomID);
  }

  get currentCharRoomContent(): ChatGPTModel[] | undefined {
    return this.chatRoomData.find(findData => findData.chatroomID === this.currentChatRoomID)?.content;
  }

  get currentChatroomFromLocalStorage(): string | null {
    return window.localStorage.getItem('currentChatroom');
  }
}
