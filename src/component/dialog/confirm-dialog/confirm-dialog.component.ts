import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animation/common-animation';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  animations: [
    fadeInOutAnimation
  ]
})
export class ConfirmDialogComponent implements AfterViewInit {
  @ViewChild('cancelButton', { static: true }) cancelButton!: ElementRef<HTMLElement>;

  @Input() title: string | undefined = '警告';
  @Input() content: string | undefined = '';
  @Output() close = new EventEmitter<boolean>();
  animationState = true;
  private result = false;
  constructor() { }

  ngAfterViewInit(): void {
    this.cancelButton.nativeElement.focus();
  }

  onOk(): void {
    this.animationState = false;
    this.result = true;
  }

  onCancel(): void {
    this.animationState = false;
    this.result = false;
  }

  onAnimationDone(event: any) {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.close.emit(this.result);
    }
  }
}
