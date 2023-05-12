import { NgIconsModule } from '@ng-icons/core';
import { RouterModule } from '@angular/router';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-slider-menu',
  templateUrl: './slider-menu.component.html',
  styleUrls: ['./slider-menu.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
    NgIconsModule
  ],
  animations: [
    trigger('fadeAnimation', [
      state('void', style({
        opacity: 0,
        display: 'none'
      })),
      state('*', style({
        opacity: 0.5,
        display: 'block'
      })),
      transition('void => *', [
        style({ opacity: 0, display: 'block' }),
        animate('300ms ease-out', style({ opacity: 0.5 }))
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SliderMenuComponent implements OnInit, OnChanges {
  @Input() showHamburger = true;
  @Input() showHamburgerSize = 0;
  private screenWidth: number = 0;
  private screenHeight: number = 0;
  showMenu = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.showHamburgerSize !== 0) {
      this.getScreenSize();
    }
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: any): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.showHamburgerSize !== 0) {
      this.getScreenSize();
    }
  }

  private getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (window.innerWidth <= this.showHamburgerSize) {
      this.showHamburger = true;
    } else {
      this.showHamburger = false;
    }
  }
}
