import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TestResultsRoutingModule } from './test-results-routing.module';
import { TestResultsComponent } from './test-results.component';
import { TestResultComponent } from './views/test-result/test-result.component';

@NgModule({
  declarations: [TestResultsComponent, TestResultComponent],
  imports: [CommonModule, TestResultsRoutingModule, SharedModule]
})
export class TestResultsModule {}
