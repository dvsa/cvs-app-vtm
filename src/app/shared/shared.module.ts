import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoleRequiredDirective } from '../directives/app-role-required.directive';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';

@NgModule({
  declarations: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent, BannerComponent, RoleRequiredDirective],
  imports: [CommonModule],
  exports: [DefaultNullOrEmpty, ButtonGroupComponent, ButtonComponent, BannerComponent, RoleRequiredDirective]
})
export class SharedModule {}
