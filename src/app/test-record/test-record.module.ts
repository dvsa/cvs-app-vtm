import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { SharedModule } from '@app/shared';
import { TestRecordComponent } from '@app/test-record/test-record.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TestSectionComponent } from './test-section/test-section.component';
import { DefectsComponent } from './defects/defects.component';
import { SeatbeltInstallationCheckComponent } from './seatbelt-installation-check/seatbelt-installation-check.component';
import { EmissionDetailsComponent } from './emission-details/emission-details.component';
import { VisitComponent } from './visit/visit.component';
import { NotesComponent } from './notes/notes.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { LibrariesModule } from '@app/shared/libraries/libraries.module';
import { RouterModule } from '@angular/router';
import { TestRecordContainer } from '@app/test-record/test-record.container';
import { DefectsEditComponent } from './defects/edit/defects-edit.component';
import { VehicleEditComponent } from './vehicle/edit/vehicle-edit.component';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SeatbeltInstallationCheckEditComponent } from './seatbelt-installation-check/edit/seatbelt-installation-check-edit.component';
import { EmissionDetailsEditComponent } from './emission-details/edit/emission-details-edit.component';
import { NotesEditComponent } from './notes/edit/notes-edit.component';
import { VisitEditComponent } from './visit/edit/visit-edit.component';
import { AutocompleteComponent } from '@app/shared/components/autocomplete/autocomplete.component';
import { VehicleTestResultModelEffects } from '@app/store/effects/VehicleTestResultModel.effects';
import { EffectsModule } from '@ngrx/effects';

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
  AutocompleteComponent
];

export const MODULES = [
  CommonModule,
  RouterModule.forChild([
    {
      path: '',
      component: TestRecordContainer,
      canActivate: [AuthenticationGuard]
    }
  ]),
  EffectsModule.forFeature([VehicleTestResultModelEffects]),
  SharedModule,
  LibrariesModule,
  ReactiveFormsModule
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
