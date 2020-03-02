import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {SharedModule} from '../shared/shared.module';
import {TestRecordComponent} from '@app/test-record/test-record.component';
import {VehicleComponent} from './vehicle/vehicle.component';
import {TestSectionComponent} from './test-section/test-section.component';
import {DefectsComponent} from './defects/defects.component';
import {SeatbeltInstallationCheckComponent} from './seatbelt-installation-check/seatbelt-installation-check.component';
import {EmissionDetailsComponent} from './emission-details/emission-details.component';
import {VisitComponent} from './visit/visit.component';
import {NotesComponent} from './notes/notes.component';
import {TestHistoryComponent} from './test-history/test-history.component';
import {LibrariesModule} from '@app/shared/libraries/libraries.module';
import {RouterModule} from '@angular/router';

export const COMPONENTS = [
  TestRecordComponent,
  VehicleComponent,
  TestSectionComponent,
  DefectsComponent,
  SeatbeltInstallationCheckComponent,
  EmissionDetailsComponent,
  VisitComponent,
  NotesComponent,
  TestHistoryComponent
];

export const MODULES = [
  CommonModule,
  RouterModule.forChild([
    {path: '', component: TestRecordComponent, canActivate: [AuthenticationGuard], runGuardsAndResolvers: 'always'}
  ]),
  SharedModule,
  LibrariesModule
];

@NgModule({
  imports: [MODULES],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class TestRecordModule {
  constructor() {
  }
}
