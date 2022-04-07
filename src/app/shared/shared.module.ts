import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';

@NgModule({
  declarations: [DefaultNullOrEmpty],
  imports: [CommonModule],
  exports: [DefaultNullOrEmpty]
})
export class SharedModule {}
