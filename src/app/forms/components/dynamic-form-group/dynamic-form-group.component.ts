import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DynamicFormService } from '../../services/dynamic-form.service';
import {
  CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes, FormNodeViewTypes,
} from '../../services/dynamic-form.types';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormGroupComponent implements OnChanges, OnInit, OnDestroy {
  @Input() data: any = {};
  @Input() template?: FormNode;
  @Input() edit = false;
  @Output() formChange = new EventEmitter();

  form: CustomFormGroup | CustomFormArray = new CustomFormGroup({ name: 'dynamic-form', type: FormNodeTypes.GROUP, children: [] }, {});

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { template, data } = changes;
    if (template && template.currentValue) {
      this.form = this.dfs.createForm(template.currentValue, this.data);
    }
    if (data?.currentValue && data.currentValue !== data.previousValue) {
      this.form.patchValue(data.currentValue, { emitEvent: false });
    }
  }

  ngOnInit(): void {
    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((e) => this.formChange.emit(e));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  entriesOf(obj: FormGroup): { key: string; value: CustomFormControl }[] {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value,
    }));
  }

  trackByFn(index: number, item: { key: string }) {
    return Object.prototype.hasOwnProperty.call(item, 'key') ? item.key : index;
  }

  get formNodeTypes(): typeof FormNodeTypes {
    return FormNodeTypes;
  }

  get formNodeViewTypes(): typeof FormNodeViewTypes {
    return FormNodeViewTypes;
  }
}
