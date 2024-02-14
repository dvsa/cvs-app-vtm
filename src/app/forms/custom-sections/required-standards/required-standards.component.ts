import { Component, Input } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';

@Component({
  selector: 'app-required-standards[template]',
  templateUrl: './required-standards.component.html',
})
export class RequiredStandardsComponent {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: Partial<TestResultModel> = {};
}
