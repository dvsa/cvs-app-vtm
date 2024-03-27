import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { EditTechRecordButtonComponent } from './components/edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordAmendReasonComponent } from './components/tech-record-amend-reason/tech-record-amend-reason.component';
import { AmendVinComponent } from './components/tech-record-amend-vin/tech-record-amend-vin.component';
import { AmendVrmComponent } from './components/tech-record-amend-vrm/tech-record-amend-vrm.component';
import { TechRecordChangeStatusComponent } from './components/tech-record-change-status/tech-record-change-status.component';
import { TechRecordUnarchiveComponent } from './components/tech-record-unarchive/tech-record-unarchive-component';
import { ChangeVehicleTypeComponent } from './components/tech-record-change-type/tech-record-change-type.component';
import { TechRecordChangeVisibilityComponent } from './components/tech-record-change-visibility/tech-record-change-visibility.component';
import { GenerateLetterComponent } from './components/tech-record-generate-letter/tech-record-generate-letter.component';
import { GeneratePlateComponent } from './components/tech-record-generate-plate/tech-record-generate-plate.component';
import { TechRecordHistoryComponent } from './components/tech-record-history/tech-record-history.component';
import { TechRecordSearchTyresComponent } from './components/tech-record-search-tyres/tech-record-search-tyres.component';
import { TechRecordTitleComponent } from './components/tech-record-title/tech-record-title.component';
import { TechRouterOutletComponent } from './components/tech-router-outlet/tech-router-outlet.component';
import { TestRecordSummaryComponent } from './components/test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './components/vehicle-technical-record/vehicle-technical-record.component';
import { SharedTechRecordsModule } from './shared-tech-record.module';
import { TechRecordsRoutingModule } from './tech-record-routing.module';
import { TechRecordComponent } from './tech-record.component';
import { AmendVrmReasonComponent } from './components/tech-record-amend-vrm-reason/tech-record-amend-vrm-reason.component';
import { TechRecordSummaryChangesComponent } from './components/tech-record-summary-changes/tech-record-summary-changes.component';
import { AdrGenerateCertificateComponent } from './components/adr-generate-certificate/adr-generate-certificate.component';
import {
  TechRecordEditAdditionalExaminerNoteComponent
} from './components/tech-record-edit-additional-examiner-note/tech-record-edit-additional-examiner-note.component';

@NgModule({
  declarations: [
    AmendVinComponent,
    AmendVrmComponent,
    AmendVrmReasonComponent,
    ChangeVehicleTypeComponent,
    EditTechRecordButtonComponent,
    TechRecordAmendReasonComponent,
    TechRecordComponent,
    TechRecordChangeStatusComponent,
    TechRecordUnarchiveComponent,
    TechRecordChangeVisibilityComponent,
    GeneratePlateComponent,
    GenerateLetterComponent,
    TechRecordHistoryComponent,
    TechRecordSearchTyresComponent,
    TechRecordTitleComponent,
    TechRecordEditAdditionalExaminerNoteComponent,
    TechRouterOutletComponent,
    TestRecordSummaryComponent,
    VehicleTechnicalRecordComponent,
    TechRecordSummaryChangesComponent,
    AdrGenerateCertificateComponent,
  ],
  imports: [CommonModule, DynamicFormsModule, ReactiveFormsModule, SharedModule, TechRecordsRoutingModule, SharedTechRecordsModule],
  exports: [EditTechRecordButtonComponent, TechRecordTitleComponent],
})
export class TechRecordsModule {}
