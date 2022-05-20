import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { VehicleTechnicalRecordComponent } from 'src/app/features/search/components/vehicle-technical-record/vehicle-technical-record.component';
import { TechRecordSummaryComponent } from './components/tech-record-summary/tech-record-summary.component';
import { TestRecordSummaryComponent } from './components/test-record-summary/test-record-summary.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent, VehicleTechnicalRecordComponent, TechRecordSummaryComponent, TestRecordSummaryComponent],
  imports: [CommonModule, SearchRoutingModule, SharedModule, DynamicFormsModule]
})
export class SearchModule {}
