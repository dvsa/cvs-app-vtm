import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { EditTechRecordButtonComponent } from './components/edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordAmendReasonComponent } from './components/tech-record-amend-reason/tech-record-amend-reason.component';
import { AmendVrmComponent } from './components/tech-record-amend-vrm/tech-record-amend-vrm.component';
import { TechRecordChangeStatusComponent } from './components/tech-record-change-status/tech-record-change-status.component';
import { ChangeVehicleTypeComponent } from './components/tech-record-change-type/tech-record-change-type.component';
import { TechRecordChangeVisibilityComponent } from './components/tech-record-change-visibility/tech-record-change-visibility.component';
import { GenerateLetterComponent } from './components/tech-record-generate-letter/tech-record-generate-letter.component';
import { GeneratePlateComponent } from './components/tech-record-generate-plate/tech-record-generate-plate.component';
import { TechRecordHistoryComponent } from './components/tech-record-history/tech-record-history.component';
import { TechRecordSearchTyresComponent } from './components/tech-record-search-tyres/tech-record-search-tyres.component';
import { TechRecordSummaryComponent } from './components/tech-record-summary/tech-record-summary.component';
import { TechRecordTitleComponent } from './components/tech-record-title/tech-record-title.component';
import { TechRouterOutletComponent } from './components/tech-router-outlet/tech-router-outlet.component';
import { TestRecordSummaryComponent } from './components/test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './components/vehicle-technical-record/vehicle-technical-record.component';
import { TechRecordsRoutingModule } from './tech-record-routing.module';
import { TechRecordComponent } from './tech-record.component';

@NgModule({
  declarations: [
    AmendVrmComponent,
    ChangeVehicleTypeComponent,
    EditTechRecordButtonComponent,
    TechRecordAmendReasonComponent,
    TechRecordComponent,
    TechRecordChangeStatusComponent,
    TechRecordChangeVisibilityComponent,
    GeneratePlateComponent,
    GenerateLetterComponent,
    TechRecordHistoryComponent,
    TechRecordSearchTyresComponent,
    TechRecordSummaryComponent,
    TechRecordTitleComponent,
    TechRouterOutletComponent,
    TestRecordSummaryComponent,
    VehicleTechnicalRecordComponent
  ],
  imports: [CommonModule, DynamicFormsModule, ReactiveFormsModule, SharedModule, TechRecordsRoutingModule],
  exports: [EditTechRecordButtonComponent, TechRecordSummaryComponent, TechRecordTitleComponent]
})
export class TechRecordsModule {}
