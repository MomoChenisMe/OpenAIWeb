import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animation/common-animation';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
  animations: [
    fadeInOutAnimation
  ]
})
export class InformationDialogComponent {
  @ViewChild('closeButton', { static: true }) closeButton!: ElementRef<HTMLElement>;

  @Input() title: string | undefined = '提示';
  @Input() content: string | undefined = '';
  @Output() close = new EventEmitter<boolean>();
  animationState = true;
  constructor() { }

  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
  }

  onClose(): void {
    this.animationState = false;
  }

  onAnimationDone(event: any) {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.close.emit(true);
    }
  }
}
