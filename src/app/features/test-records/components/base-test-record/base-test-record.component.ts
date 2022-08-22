import { AfterViewChecked, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defects/defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import merge from 'lodash.merge';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent implements AfterViewChecked {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() sectionTemplates: FormNode[] = [];
  @Input() defectsData: Defect[] | null = null;
  @Input() techRecord?: TechRecordModel | null | undefined;

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  ngAfterViewChecked(): void {
    this.handleFormChange({});
  }

  handleFormChange(event: any) {
    let latestTest = {};
    this.sections?.forEach(section => {
      const { form } = section;
      latestTest = merge(latestTest, form.getCleanValue(form));
    });
    const defectsValue = this.defects?.form.getCleanValue(this.defects?.form);
    latestTest = merge(latestTest, defectsValue, event);
    this.newTestResult.emit(latestTest as TestResultModel);
  }
}
