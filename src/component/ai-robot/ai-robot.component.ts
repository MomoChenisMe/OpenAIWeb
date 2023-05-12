import { HttpService } from './../../app/service/http.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatGPTCusFormModel, ChatGPTCusModel, HotKeyButtonModel, ChatGPTModel } from 'src/app/model/custom';
import { MarkdownModule } from 'ngx-markdown';
import { NgIconsModule } from '@ng-icons/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  standalone: true,
  selector: 'app-ai-robot',
  templateUrl: './ai-robot.component.html',
  styleUrls: ['./ai-robot.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule,
    NgIconsModule
  ],
  animations: [
    trigger('aiRobotPopoverAnimation', [
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
  ]
})
export class AiRobotComponent implements OnChanges {
  @ViewChild('contentInputField', { static: false }) contentInputField!: ElementRef;
  @Input() systemPrompt = '';
  @Input() promptText = '';
  @Input() content = '';
  @Input() hotKeyButtonList: HotKeyButtonModel[] = [];
  @Input() tokenizerObservable$: Observable<number> = new Observable<number>();
  @Output() tipsClick = new EventEmitter<string>();

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private sendChatData: ChatGPTModel[] = [];
  currentChatIndex = 0;
  loading$ = this.loadingSubject$.asObservable();
  chatData: ChatGPTCusModel[] = [];
  chatGPTForm: FormGroup<ChatGPTCusFormModel>;
  showPopover = false;

  constructor(private httpService: HttpService, private fb: FormBuilder,
    private authService: AuthService) {
    this.chatGPTForm = this.fb.group({
      role: ['user', Validators.required],
      content: ['', Validators.required],
      time: [new Date()]
    });

  }

  get UserPicture(): string | undefined {
    return this.authService.tokenInfo?.picture;
  }

  hotKeyClass(hotKeyButton: HotKeyButtonModel): string {
    let className = '';
    className += hotKeyButton.color ? `${hotKeyButton.color} ` : 'bg-violet-700 ';
    className += hotKeyButton.hoverColor ? `hover:${hotKeyButton.hoverColor} ` : 'hover:bg-violet-800 ';
    return className;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('content' in changes) {
      this.sendChatData = [];
      this.sendChatData.push({ role: 'system', content: `Your name is ChatGPT AI助理. ${this.systemPrompt}` });
    }
  }

  openDialog() {
    this.showPopover = !this.showPopover;
    if (this.showPopover) {
      setTimeout(() => {
        this.contentInputField.nativeElement.focus();
      }, 100);
    }
  }

  onCommandSendClick() {
    if (this.chatGPTForm.valid) {
      this.loadingSubject$.next(true);
      let data = `Context: ${this.content === '' ? '無上下文' : this.content}\n\nCommand: ${this.content === '' ? '無上下文請忽略' : this.chatGPTForm.value.content}`;
      this.chatData.push({ role: this.chatGPTForm.value.role!, content: this.chatGPTForm.value.content!, time: new Date() });
      this.chatData.push({ role: 'assistant', content: '', time: new Date() });
      this.currentChatIndex = this.chatData.length - 1;
      this.sendChatData.push({ role: this.chatGPTForm.value.role!, content: data });
      this.chatGPTForm.reset({
        role: 'user',
        content: ''
      });
      this.httpService.openAIAPIPost('/OpenAI/ChatGPTStream', this.sendChatData).subscribe({
        next: (result) => {
          let data = this.chatData[this.currentChatIndex];
          data.content += result.text;
          this.chatData[this.currentChatIndex] = data;
        },
        complete: () => {
          this.sendChatData.splice(1, 1);
          this.loadingSubject$.next(false);
        }
      });
    }
  }

  onHotKeyButtonClick(hotKey: string) {
    this.chatGPTForm.patchValue({
      content: hotKey
    });
    this.onCommandSendClick();
  }

  onTipsClick(tipContent: string) {
    this.tipsClick.emit(tipContent);
  }
}
