import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/animation/common-animation';


@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
  animations: [
    fadeInOutAnimation
  ],
})
export class WarningDialogComponent {
  @ViewChild('closeButton', { static: true }) closeButton!: ElementRef<HTMLElement>;

  @Input() title: string | undefined = '警告';
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
