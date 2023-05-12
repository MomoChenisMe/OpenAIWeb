import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgIconsModule } from '@ng-icons/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { DialogService } from './dialog.service';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';



@NgModule({
  declarations: [
    WarningDialogComponent,
    ConfirmDialogComponent,
    InformationDialogComponent
  ],
  imports: [
    CommonModule,
    NgIconsModule
  ],
  providers: [
    DialogService
  ]
})
export class DialogModule { }
