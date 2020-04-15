import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContainerComponent } from './modal.container.component';
import { LoseChangesComponent } from './components/lose-changes/lose-changes.component';
import { ModalComponent } from './modal.component';
import { ModalEffects } from './modal.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ModalEffects]),
  ],
  declarations: [ModalContainerComponent, ModalComponent, LoseChangesComponent],
  entryComponents: [ModalComponent, LoseChangesComponent],
  exports: [ModalContainerComponent],
})
export class ModalModule { }
