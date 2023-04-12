import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';

@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [CommonModule, DynamicFormsModule, RouterModule, ReferenceDataRoutingModule, SharedModule]
})
export class ReferenceDataModule {}
