import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@app/shared';
import { RouterModule } from '@angular/router';
import { LibrariesModule } from '@app/shared/libraries/libraries.module';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

import { TestRecordComponent } from '@app/test-record/test-record.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TestSectionComponent } from './test-section/test-section.component';
import { DefectsComponent } from './defects/defects.component';
import { SeatbeltInstallationCheckComponent } from './seatbelt-installation-check/seatbelt-installation-check.component';
import { EmissionDetailsComponent } from './emission-details/emission-details.component';
import { VisitComponent } from './visit/visit.component';
import { NotesComponent } from './notes/notes.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TestRecordContainer } from '@app/test-record/test-record.container';
import { DefectsEditComponent } from './defects/edit/defects-edit.component';
import { VehicleEditComponent } from './vehicle/edit/vehicle-edit.component';
import { SeatbeltInstallationCheckEditComponent } from './seatbelt-installation-check/edit/seatbelt-installation-check-edit.component';
import { EmissionDetailsEditComponent } from './emission-details/edit/emission-details-edit.component';
import { NotesEditComponent } from './notes/edit/notes-edit.component';
import { VisitEditComponent } from './visit/edit/visit-edit.component';
import { AutocompleteComponent } from '@app/shared/components/autocomplete/autocomplete.component';
import { TestSectionEditComponent } from './test-section/edit/test-section-edit.component';
import { SelectTestTypeComponent } from './select-test-type/select-test-type.component';
import { TimeInputComponent } from '@app/shared/components/time-input/time-input.component';
import { VehicleTestResultModelEffects } from '@app/store/effects/VehicleTestResultModel.effects';
import { SelectTestTypeContainer } from '@app/test-record/select-test-type/select-test-type.container';
import { TestResultGuard } from '@app/test-record/guards/test-result.guard';
import { PreparersGuard } from '@app/test-record/guards/preparers.guard';
import { TestStationsGuard } from '@app/test-record/guards/test-stations.guard';
import { TestTypeCategoriesGuard } from '@app/test-record/guards/test-type-categories.guard';
import { TreeComponent } from '@app/shared/components/tree/tree.component.ts';

export const COMPONENTS = [
  TestRecordComponent,
  VehicleComponent,
  TestSectionComponent,
  DefectsComponent,
  SeatbeltInstallationCheckComponent,
  EmissionDetailsComponent,
  VisitComponent,
  NotesComponent,
  TestHistoryComponent,
  TestRecordContainer,
  DefectsEditComponent,
  VehicleEditComponent,
  SeatbeltInstallationCheckEditComponent,
  EmissionDetailsEditComponent,
  NotesEditComponent,
  VisitEditComponent,
  AutocompleteComponent,
  TimeInputComponent,
  TestSectionEditComponent,
  SelectTestTypeComponent,
  SelectTestTypeContainer,
  TreeComponent
];

export const MODULES = [
  CommonModule,
  RouterModule.forChild([
    {
      path: 'test-record/:id',
      component: TestRecordContainer,
      canActivate: [AuthenticationGuard, TestResultGuard, PreparersGuard, TestStationsGuard],
    },
    {
      path: 'select-test-type/:id',
      component: SelectTestTypeContainer,
      canActivate: [TestTypeCategoriesGuard]
    }
  ]),
  EffectsModule.forFeature([VehicleTestResultModelEffects]),
  SharedModule,
  LibrariesModule,
  ReactiveFormsModule,
  MaterialModule
];

@NgModule({
  imports: [MODULES],
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  providers: [FormGroupDirective]
})
export class TestRecordModule {
  constructor() {}
}
