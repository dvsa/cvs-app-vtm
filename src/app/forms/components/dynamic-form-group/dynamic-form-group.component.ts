import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormGroupComponent implements OnChanges {
  @Input() data: any = {};
  @Input() template?: FormNode;
  @Input() edit = false;

  form: CustomFormGroup | CustomFormArray = new CustomFormGroup({ name: 'dynamic-form', type: FormNodeTypes.GROUP, children: [] }, {});

  constructor(private dfs: DynamicFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { template } = changes;
    if (template && template.currentValue) {
      this.form = this.dfs.createForm(template.currentValue, this.data);
    }
  }

  entriesOf(obj: FormGroup): { key: string; value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value
    }));
  }

  trackByFn(index: number, item: any) {
    return item.hasOwnProperty('key') ? item.key : index;
  }

  get formNodeTypes(): typeof FormNodeTypes {
    return FormNodeTypes;
  }

  get formNodeViewTypes(): typeof FormNodeViewTypes {
    return FormNodeViewTypes;
  }
}
