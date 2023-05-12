import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true
})
export class LogoComponent {
  @Input() cssClass = 'absolute top-4 right-4 h-12 w-24';
  @Input() isFill = true;
  @Input() fillColor = '#000000';
}
