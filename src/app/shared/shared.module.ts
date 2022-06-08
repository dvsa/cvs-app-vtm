import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';

@NgModule({
  declarations: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent],
  imports: [CommonModule],
  exports: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent]
})
export class SharedModule {}
