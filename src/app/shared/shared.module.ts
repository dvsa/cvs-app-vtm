import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { AccordionControlComponent } from './components/accordion-control/accordion-control.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { BannerComponent } from './components/banner/banner.component';
import { BaseDialogComponent } from './components/base-dialog/base-dialog.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { InputSpinnerComponent } from './components/input-spinner/input-spinner.component';
import { NumberPlateComponent } from './components/number-plate/number-plate.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RouterOutletComponent } from './components/router-outlet/router-outlet.component';
import { TagComponent } from './components/tag/tag.component';
import { TestCertificateComponent } from './components/test-certificate/test-certificate.component';
import { PreventDoubleClickDirective } from './directives/prevent-double-click/prevent-double-click.directive';
import { RetrieveDocumentDirective } from './directives/retrieve-document/retrieve-document.directive';
import { DefaultNullOrEmpty } from './pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DigitGroupSeparatorPipe } from './pipes/digit-group-separator/digit-group-separator.pipe';
import { RefDataDecodePipe } from './pipes/ref-data-decode/ref-data-decode.pipe';
import { TestTypeNamePipe } from './pipes/test-type-name/test-type-name.pipe';
import { TyreAxleLoadPipe } from './pipes/tyre-axle-load/tyre-axle-load.pipe';
import { GetControlLabelPipe } from './pipes/get-control-label/get-control-label.pipe';
import { FormatVehicleTypePipe } from './pipes/format-vehicle-type/format-vehicle-type.pipe';

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
    TestTypeNamePipe,
    AccordionComponent,
    AccordionControlComponent,
    PaginationComponent,
    TestCertificateComponent,
    PreventDoubleClickDirective,
    BaseDialogComponent,
    DigitGroupSeparatorPipe,
    RefDataDecodePipe,
    RetrieveDocumentDirective,
    InputSpinnerComponent,
    RouterOutletComponent,
    TyreAxleLoadPipe,
    GetControlLabelPipe,
    FormatVehicleTypePipe
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    DefaultNullOrEmpty,
    ButtonGroupComponent,
    ButtonComponent,
    BannerComponent,
    RoleRequiredDirective,
    TagComponent,
    NumberPlateComponent,
    IconComponent,
    TestTypeNamePipe,
    AccordionComponent,
    AccordionControlComponent,
    PaginationComponent,
    TestCertificateComponent,
    BaseDialogComponent,
    DigitGroupSeparatorPipe,
    RefDataDecodePipe,
    RetrieveDocumentDirective,
    InputSpinnerComponent,
    RouterOutletComponent,
    TyreAxleLoadPipe,
    GetControlLabelPipe,
    FormatVehicleTypePipe
  ],
  providers: [DocumentRetrievalService]
})
export class SharedModule {}
