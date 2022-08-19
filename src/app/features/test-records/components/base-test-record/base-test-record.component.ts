import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { TestTypeSelectComponent } from '@forms/components/test-type-select/test-type-select.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';

@Component({
  selector: 'app-base-test-record[testResult][defectsData]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;
  @ViewChild(TestTypeSelectComponent) requiredProps?: TestTypeSelectComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() sectionTemplates: FormNode[] = [];
  @Input() defectsData!: Defect[] | null;

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  handleFormChange(event: any) {
    this.newTestResult.emit(event);
  }
}
