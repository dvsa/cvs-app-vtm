import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoleRequiredDirective } from '../directives/app-role-required.directive';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TagComponent } from './components/tag/tag.component';
import { NumberPlateComponent } from './components/number-plate/number-plate.component';
import { IconComponent } from './components/icon/icon.component';
import { TestTypeNamePipe } from './pipes/test-type-name/test-type-name.pipe';

@NgModule({
  declarations: [
    DefaultNullOrEmpty,
    ButtonGroupComponent,
    ButtonComponent,
    BannerComponent,
    RoleRequiredDirective,
    TagComponent,
    NumberPlateComponent,
    IconComponent,
    TestTypeNamePipe
  ],
  imports: [CommonModule],
  exports: [
    DefaultNullOrEmpty,
    ButtonGroupComponent,
    ButtonComponent,
    BannerComponent,
    RoleRequiredDirective,
    TagComponent,
    NumberPlateComponent,
    IconComponent,
    TestTypeNamePipe
  ]
})
export class SharedModule {}
