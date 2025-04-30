// eslint-disable-next-line max-classes-per-file
import { ChangeDetectorRef } from '@angular/core';
import {
	AbstractControl,
	AbstractControlOptions,
	AsyncValidatorFn,
	FormArray,
	FormControl,
	FormControlOptions,
	FormGroup,
	ValidatorFn,
} from '@angular/forms';
import { Params } from '@angular/router';
// eslint-disable-next-line import/no-cycle
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ValidatorNames } from '@models/validators.enum';
import { Store } from '@ngrx/store';
import { SpecialRefData } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { Observable, map } from 'rxjs';
import { TagTypes } from '../../components/tag/tag.component';
// eslint-disable-next-line import/no-cycle
import { DynamicFormService } from './dynamic-form.service';

export enum FormNodeViewTypes {
	DATE = 'date',
	DATETIME = 'dateTime',
	FULLWIDTH = 'fullWidth',
	HIDDEN = 'hidden',
	STRING = 'string',
	SUBHEADING = 'subHeading',
	TIME = 'time',
	VEHICLETYPE = 'vehicleType',
	VRM = 'vrm',
	CUSTOM = 'custom',
	ADR_EXAMINER_NOTES = 'adrExaminerNotes', // TODO: remove in favour of custom
}

export enum TagTypeLabels {
	REQUIRED = 'Required',
	PLATES = 'Plates',
}

export enum FormNodeTypes {
	ARRAY = 'array',
	COMBINATION = 'combination',
	CONTROL = 'control',
	DIMENSIONS = 'dimensions',
	GROUP = 'group',
	ROOT = 'root',
	SECTION = 'section',
	TITLE = 'title',
	SUBTITLE = 'subtitle',
}

export enum FormNodeEditTypes {
	AUTOCOMPLETE = 'autocomplete',
	CHECKBOX = 'checkbox',
	CHECKBOXGROUP = 'checkboxgroup',
	DATE = 'date',
	DATETIME = 'datetime',
	DROPDOWN = 'dropdown',
	HIDDEN = 'hidden',
	NUMBER = 'number',
	NUMERICSTRING = 'numericstring',
	RADIO = 'radio',
	SELECT = 'select',
	TEXT = 'text',
	TEXTAREA = 'textarea',
	APPROVAL_TYPE = 'approvalType',
	CUSTOM = 'custom',
}

export enum FormNodeWidth {
	XXXL = 50,
	XXL = 30,
	XL = 20,
	L = 10,
	M = 5,
	S = 4,
	XS = 3,
	XXS = 2,
	UNSET = 'unset',
}

export interface FormNodeOption<T> {
	value: T;
	label: string;
	hint?: string;
}

type AsyncValidatorOptions = AsyncValidatorFn | AsyncValidatorFn[] | null;

export interface FormNode {
	name: string;
	children?: FormNode[];
	type: FormNodeTypes; // maybe updateType?
	viewType?: FormNodeViewTypes;
	editType?: FormNodeEditTypes;
	width?: FormNodeWidth;
	label?: string;
	labelClass?: string;
	hint?: string;
	link?: string;
	delimited?: { regex?: string; separator: string };
	value?: unknown;
	path?: string;
	options?: FormNodeOption<string | number | boolean | null>[] | FormNodeCombinationOptions;
	validators?: FormNodeValidator[];
	customErrorMessage?: string;
	customValidatorErrorName?: string;
	asyncValidators?: { name: AsyncValidatorNames; args?: unknown }[];
	disabled?: boolean;
	readonly?: boolean;
	hide?: boolean;
	required?: boolean;
	changeDetection?: ChangeDetectorRef;
	subHeadingLink?: SubHeadingLink;
	referenceData?: ReferenceDataResourceType | SpecialRefData;
	suffix?: string;
	isoDate?: boolean;
	class?: string;
	customId?: string;
	warning?: string;
	customTags?: CustomTag[];
	enableDecimals?: boolean;
	groups?: string[];
	viewComponent?: typeof BaseControlComponent;
	editComponent?: typeof BaseControlComponent;
	uppercase?: boolean;
}

export interface CustomTag {
	label: TagTypeLabels;
	colour: TagTypes;
}

export interface FormNodeValidator {
	name: ValidatorNames;
	args?: unknown;
}

export interface FormNodeCombinationOptions {
	leftComponentName: string;
	rightComponentName: string;
	separator: string;
}

export interface SubHeadingLink {
	label: string;
	url: string;
	queryParams?: Params;
}

export interface CustomControl extends FormControl {
	meta: FormNode;
}

export interface SearchParams {
	systemNumber?: string;
	vin?: string;
	reason?: string;
	axleNumber?: number;
}

export class CustomFormControl extends FormControl implements CustomControl {
	meta: FormNode;

	constructor(
		meta: FormNode,
		formState?: unknown,
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
		asyncValidator?: AsyncValidatorOptions
	) {
		super(formState, validatorOrOpts, asyncValidator);
		this.meta = meta;
	}
}

interface BaseForm {
	/**
	 * function that returns the json object value of the form after removing all the disabled controls
	 * and properties where meta.type is not 'control', 'group' or 'array
	 *
	 * @returns form json value
	 */
	getCleanValue: (form: CustomFormGroup | CustomFormArray) => { [key: string]: unknown } | Array<[]>;

	cleanValueChanges: Observable<unknown>;
}

export interface CustomGroup extends FormGroup {
	meta: FormNode;
}

export class CustomFormGroup extends FormGroup implements CustomGroup, BaseForm {
	meta: FormNode;

	constructor(
		meta: FormNode,
		controls: {
			[key: string]: AbstractControl;
		},
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
		asyncValidator?: AsyncValidatorOptions
	) {
		super(controls, validatorOrOpts, asyncValidator);
		this.meta = meta;
	}

	getCleanValue = cleanValue.bind(this);

	get cleanValueChanges() {
		return this.valueChanges.pipe(map(() => this.getCleanValue(this)));
	}
}

export interface CustomArray extends FormArray {
	meta: FormNode;
}

export class CustomFormArray extends FormArray implements CustomArray, BaseForm {
	meta: FormNode;
	private dynamicFormService: DynamicFormService;

	constructor(
		meta: FormNode,
		controls: AbstractControl[],
		store: Store<State>,
		technicalRecordService: TechnicalRecordService,
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
		asyncValidator?: AsyncValidatorOptions
	) {
		super(controls, validatorOrOpts, asyncValidator);
		this.meta = meta;
		this.dynamicFormService = new DynamicFormService(store, technicalRecordService);
	}

	getCleanValue = cleanValue.bind(this);

	get cleanValueChanges() {
		return this.valueChanges.pipe(map(() => this.getCleanValue(this)));
	}

	addControl(data?: unknown): void {
		if (this.meta?.children) {
			super.push(this.dynamicFormService.createForm(this.meta.children[0], data));
		}
	}

	override patchValue(
		value: unknown[] | undefined | null,
		options?: {
			onlySelf?: boolean;
			emitEvent?: boolean;
		}
	): void {
		if (value) {
			if (value.length !== this.controls.length && this.meta.children && this.meta.children[0].type === 'group') {
				if (value.length > this.controls.length) {
					super.push(this.dynamicFormService.createForm(this.meta.children[0], value));
				} else {
					this.controls.pop();
				}
			}
			super.patchValue(value, options);
		}
	}
}

// TODO: clean this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanValue = (form: CustomFormGroup | CustomFormArray): Record<string, any> | Array<[]> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const localCleanValue = form instanceof CustomFormArray ? [] : ({} as Record<string, any>);
	Object.keys(form.controls).forEach((key) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, security/detect-object-injection
		const control = (form.controls as any)[key];
		if (control instanceof CustomFormGroup && control.meta.type === FormNodeTypes.GROUP) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, security/detect-object-injection
			(localCleanValue as any)[key] = objectOrNull(control.getCleanValue(control));
		} else if (control instanceof CustomFormArray) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, security/detect-object-injection
			(localCleanValue as any)[key] = control.getCleanValue(control);
		} else if (control instanceof CustomFormControl && control.meta.type === FormNodeTypes.CONTROL) {
			if (control.meta.required && control.meta.hide) {
				pushOrAssignAt(control.meta.value || null, localCleanValue, key);
			} else if (!control.meta.hide) {
				pushOrAssignAt(control.value, localCleanValue, key);
			}
		}
	});

	return localCleanValue;
};

function objectOrNull(obj: Object) {
	return Object.values(obj).some((value) => undefined !== value) ? obj : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pushOrAssignAt(value: any, localCleanValue: Array<[]> | Record<string, unknown>, key: string) {
	if (Array.isArray(localCleanValue)) {
		localCleanValue.push(value);
	} else {
		localCleanValue[`${key}`] = value;
	}
}
