import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	input,
	output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormArray,
	CustomFormGroup,
	FormNode,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DynamicFormFieldComponent } from '../dynamic-form-field/dynamic-form-field.component';
import { ViewCombinationComponent } from '../view-combination/view-combination.component';
import { ViewListItemComponent } from '../view-list-item/view-list-item.component';

@Component({
	selector: 'app-dynamic-form-group',
	templateUrl: './dynamic-form-group.component.html',
	styleUrls: ['./dynamic-form-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		NgIf,
		NgSwitch,
		NgSwitchCase,
		RouterLink,
		NgFor,
		FormsModule,
		ReactiveFormsModule,
		ViewListItemComponent,
		DynamicFormFieldComponent,
		NgClass,
		ViewCombinationComponent,
	],
})
export class DynamicFormGroupComponent implements OnChanges, OnInit, OnDestroy {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly data = input<any>({});
	readonly template = input<FormNode>();
	readonly edit = input(false);
	readonly parentForm = input<CustomFormGroup>();
	readonly formChange = output<Record<string, unknown>>();

	form: CustomFormGroup | CustomFormArray = new CustomFormGroup(
		{ name: 'dynamic-form', type: FormNodeTypes.GROUP, children: [] },
		{}
	);

	private destroy$ = new Subject<void>();

	constructor(private dfs: DynamicFormService) {}

	ngOnChanges(changes: SimpleChanges): void {
		const { template, data } = changes;
		if (template && template.currentValue) {
			this.form = this.dfs.createForm(template.currentValue, this.data());
		}
		if (data?.currentValue && data.currentValue !== data.previousValue) {
			this.form.patchValue(data.currentValue, { emitEvent: false });
		}
	}

	ngOnInit(): void {
		this.form.cleanValueChanges
			.pipe(debounceTime(400), takeUntil(this.destroy$))
			.subscribe((e) => this.formChange.emit(e as Record<string, unknown>));
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
