import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';
import { BannerComponent } from './components/banner/banner.component';

@NgModule({
  declarations: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent, BannerComponent],
  imports: [CommonModule],
  exports: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent, BannerComponent]
})
export class SharedModule {}
