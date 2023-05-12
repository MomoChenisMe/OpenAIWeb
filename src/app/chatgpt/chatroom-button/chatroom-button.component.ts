import { BehaviorSubject, Observable } from 'rxjs';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ChatRoomModal, ChatroomNameFormModel } from 'src/app/model/custom';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatroom-button',
  templateUrl: './chatroom-button.component.html',
  styleUrls: ['./chatroom-button.component.scss']
})
export class ChatroomButtonComponent implements OnChanges {
  @Input() chatroom!: ChatRoomModal;
  @Input() currentChatroomID: string = '';
  @Input() chatDisabled: boolean | null = false;
  @Output() chatroomClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() chatroomDeleteClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() chatroomEditSaveClick: EventEmitter<any> = new EventEmitter();

  private isEditSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isEdit$ = this.isEditSubject$.asObservable();

  private isDeleteSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDelete$ = this.isDeleteSubject$.asObservable();
  chatroomNameForm: FormGroup<ChatroomNameFormModel>;

  constructor(private fb: FormBuilder) {
    this.chatroomNameForm = this.fb.group({
      chatName: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if ('chatroom' in changes) {
      this.chatroomNameForm.patchValue({
        chatName: this.chatroom.chatName
      });
    }
  }

  onChatroomClick() {
    this.chatroomClick.emit(this.chatroom?.chatroomID);
  }

  onChatroomEditClick() {
    this.isEditSubject$.next(true);
  }

  onChatroomEditCancelClick() {
    this.isEditSubject$.next(false);
    this.chatroomNameForm.reset({
      chatName: this.chatroom.chatName
    });
  }

  onChatroomEditSaveClick() {
    if (this.chatroomNameForm.valid && this.chatroomNameForm.value.chatName) {
      this.chatroom.chatName = this.chatroomNameForm.value.chatName;
      this.isEditSubject$.next(false);
      this.chatroomEditSaveClick.emit();
    }
  }

  onChatroomDeleteClick() {
    this.isDeleteSubject$.next(true);
  }

  onChatroomDeleteCancelClick() {
    this.isDeleteSubject$.next(false);
  }

  onChatroomDeleteSaveClick() {
    this.isDeleteSubject$.next(false);
    this.chatroomDeleteClick.emit(this.chatroom?.chatroomID);
  }
}
