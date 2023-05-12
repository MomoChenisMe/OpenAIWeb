import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChatGPTCusModel, ChatGPTModel, OpenTextModal, QAFormModel, UsingTextModal } from '../model/custom';
import { HttpService } from '../service/http.service';
import { AuthService } from '../service/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-qachat-gpt',
  templateUrl: './qa-chatgpt.component.html',
  styleUrls: ['./qa-chatgpt.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ])
  ]
})
export class QAChatGPTComponent {
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private generateUsingTextSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();
  generateUsingText$ = this.generateUsingTextSubject$.asObservable();
  qaTextAnimationState = 'out';
  chatData: ChatGPTCusModel[] = [];
  userChatData: ChatGPTModel = {
    role: 'user',
    content: '您可以在此詢問任何的QA問題。',
  }
  qaChatData: ChatGPTModel = {
    role: 'assistant',
    content: '您好，有什麼問題需要我的幫忙嗎？',
  }
  // citationsText: OpenTextModal | undefined = {
  //   id: '',
  //   name: '123',
  //   textContent: '',
  //   textHtml: '',
  //   folderId: ''
  // };
  citationsText: OpenTextModal | undefined;
  usingTextData: UsingTextModal[] = [];
  qaForm: FormGroup<QAFormModel>;

  constructor(private httpService: HttpService, private fb: FormBuilder,
    private authService: AuthService) {
    this.qaForm = this.fb.group({
      question: ['', Validators.required]
    });
  }

  get UserPicture(): string | undefined {
    return this.authService.tokenInfo?.picture;
  }

  ngOnInit(): void { }

  onOpenQATextClick(guid: string) {
    this.qaTextAnimationState = 'in';
    this.loadingSubject$.next(true);
    this.httpService.get<OpenTextModal>(`/TextManagement/GetText/${guid}`).subscribe(result => {
      this.citationsText = result;
      this.loadingSubject$.next(false);
    });
  }

  onCloseQATextClick(e: Event) {
    e.stopPropagation();
    this.qaTextAnimationState = 'out';
  }

  onQASendClick() {
    if (this.qaForm.valid) {
      this.loadingSubject$.next(true);

      this.userChatData.content = this.qaForm.value.question!;
      this.qaChatData.content = '';
      this.citationsText = undefined;
      this.usingTextData = [];
      let qaBody = this.qaForm.value;
      // this.chatData.push({ role: 'user', content: qaBody.question!, time: new Date() });
      // this.chatData.push({ role: 'assistant', content: '', time: new Date() });
      this.qaForm.reset();
      this.httpService.openAIAPIPost('/OpenAI/QAStream', qaBody).subscribe({
        next: (result) => {
          if ('text' in result) {
            if (result.text === '[DONE]') {
              this.generateUsingTextSubject$.next(true);
            } else {
              this.qaChatData.content += result.text;
            }
          } else if ('usingText' in result) {
            console.log(result);
            this.usingTextData = result.usingText;
          }
        },
        complete: () => {
          this.loadingSubject$.next(false);
          this.generateUsingTextSubject$.next(false);
        }
      });
    }
  }
}
