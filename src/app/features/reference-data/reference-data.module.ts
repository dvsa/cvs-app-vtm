import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';

@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [CommonModule, DynamicFormsModule, RouterModule, ReferenceDataRoutingModule, SharedModule]
})
export class ReferenceDataModule {}
