import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContainerComponent } from './modal.container.component';
import { LoseChangesComponent } from './components/lose-changes/lose-changes.component';
import { ModalComponent } from './modal.component';
import { ModalEffects } from './modal.effects';
import { EffectsModule } from '@ngrx/effects';
import { TestDeleteReasonModalComponent } from '@app/modal/components/test-delete-reason-modal/test-delete-reason-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, EffectsModule.forFeature([ModalEffects])],
  declarations: [
    ModalContainerComponent,
    ModalComponent,
    LoseChangesComponent,
    TestDeleteReasonModalComponent
  ],
  entryComponents: [ModalComponent, LoseChangesComponent, TestDeleteReasonModalComponent],
  exports: [ModalContainerComponent]
})
export class ModalModule {}
