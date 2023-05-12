import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { fadeInUpRouterAnimation } from './animation/common-animation';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInUpRouterAnimation
  ]
})
export class AppComponent {

  constructor(private contexts: ChildrenOutletContexts) {
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
