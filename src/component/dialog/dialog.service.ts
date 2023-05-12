import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Observable, switchMap, tap } from 'rxjs';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogModel } from './dialog.model';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';

@Injectable()
export class DialogService {
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });
  }

  informationDialog(dialog?: DialogModel) {
    return new Observable<ComponentRef<InformationDialogComponent>>(observer => {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
      }
      const overlayRef = this.overlayRef.attach(new ComponentPortal(InformationDialogComponent, null, this.createInjector()));
      overlayRef.instance.title = dialog?.title;
      overlayRef.instance.content = dialog?.content;

      observer.next(overlayRef);
      observer.complete();
    }).pipe(
      switchMap(overlayRefResult => overlayRefResult.instance.close),
      tap(result => this.overlayRef.detach())
    );
  }

  warningDialog(dialog?: DialogModel) {
    return new Observable<ComponentRef<WarningDialogComponent>>(observer => {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
      }
      const overlayRef = this.overlayRef.attach(new ComponentPortal(WarningDialogComponent, null, this.createInjector()));
      overlayRef.instance.title = dialog?.title;
      overlayRef.instance.content = dialog?.content;

      observer.next(overlayRef);
      observer.complete();
    }).pipe(
      switchMap(overlayRefResult => overlayRefResult.instance.close.pipe(
        tap(dialogResult => overlayRefResult.instance)
      )),
      tap(result => this.overlayRef.detach())
    );
  }

  confirmDialog(dialog?: DialogModel) {
    return new Observable<ComponentRef<ConfirmDialogComponent>>(observer => {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
      }
      const overlayRef = this.overlayRef.attach(new ComponentPortal(ConfirmDialogComponent, null, this.createInjector()));
      overlayRef.instance.title = dialog?.title;
      overlayRef.instance.content = dialog?.content;

      observer.next(overlayRef);
      observer.complete();
    }).pipe(
      switchMap(overlayRefResult => overlayRefResult.instance.close),
      tap(result => this.overlayRef.detach())
    );
  }

  private createInjector(): Injector {
    return Injector.create({
      providers: [],
      parent: this.injector,
    });
  }
}
