import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { TestTypeSelectComponent } from '@forms/components/test-type-select/test-type-select.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-result.model';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import merge from 'lodash.merge';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent {
  @ViewChildren(DynamicFormGroupComponent) sections?: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DefectsComponent) defects?: DefectsComponent;
  @ViewChild(TestTypeSelectComponent) requiredProps?: TestTypeSelectComponent;

  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;
  @Input() sectionTemplates: FormNode[] = [];
  @Input() techRecord?: TechRecordModel | null | undefined;

  @Output() newTestResult = new EventEmitter<TestResultModel>();

  handleFormChange(event: any) {
    let latestTest = {};
    this.sections?.forEach(section => {
      const { form } = section;
      latestTest = merge(latestTest, form.getCleanValue(form));
    });
    const defectsValue = this.defects?.form?.getCleanValue(this.defects?.form);
    const requiredProps = this.requiredProps?.form?.getCleanValue(this.requiredProps?.form);
    latestTest = merge(latestTest, defectsValue, requiredProps, event);
    this.newTestResult.emit(event);
  }
}
