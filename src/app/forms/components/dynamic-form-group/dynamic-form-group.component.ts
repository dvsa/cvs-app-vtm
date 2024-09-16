import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormArray,
	CustomFormGroup,
	FormNode,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
	selector: 'app-dynamic-form-group',
	templateUrl: './dynamic-form-group.component.html',
	styleUrls: ['./dynamic-form-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormGroupComponent implements OnChanges, OnInit, OnDestroy {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Input() data: any = {};
	@Input() template?: FormNode;
	@Input() edit = false;
  @Input() parentForm?: CustomFormGroup;
	@Output() formChange = new EventEmitter();

	form: CustomFormGroup | CustomFormArray = new CustomFormGroup(
		{ name: 'dynamic-form', type: FormNodeTypes.GROUP, children: [] },
		{}
	);

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
		this.form.cleanValueChanges
			.pipe(debounceTime(400), takeUntil(this.destroy$))
			.subscribe((e) => this.formChange.emit(e));
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	entriesOf(obj: FormGroup): { key: string; value: any }[] {
		return Object.entries(obj).map(([key, value]) => ({
			key,
			value,
		}));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	trackByFn(index: number, item: any) {
		return Object.prototype.hasOwnProperty.call(item, 'key') ? item.key : index;
	}

	get formNodeTypes(): typeof FormNodeTypes {
		return FormNodeTypes;
	}

	get formNodeViewTypes(): typeof FormNodeViewTypes {
		return FormNodeViewTypes;
	}
}
