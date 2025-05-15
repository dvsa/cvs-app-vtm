import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ErrorMessageMap } from '@forms/utils/error-message-map';
import { AdrValidators } from '@forms/validators/adr/adr.validators';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validator/custom-async-validators';
import {
	CustomValidators,
	EnumValidatorOptions,
	IsArrayValidatorOptions,
} from '@forms/validators/custom-validators/custom-validators';
import { DefectValidators } from '@forms/validators/defects/defect.validators';
import { AsyncValidatorNames } from '@models/async-validators.enum';
import { Condition } from '@models/condition.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { ValidatorNames } from '@models/validators.enum';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { CustomFormArray, CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes } from './dynamic-form.types';

type CustomFormFields = CustomFormControl | CustomFormArray | CustomFormGroup;

@Injectable({
	providedIn: 'root',
})
export class DynamicFormService {
	constructor(
		private store: Store<State>,
		private technicalRecordService: TechnicalRecordService,
		private routerService: RouterService
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	validatorMap: Record<ValidatorNames, (args: any) => ValidatorFn> = {
		[ValidatorNames.AheadOfDate]: (arg: string) => CustomValidators.aheadOfDate(arg),
		[ValidatorNames.Alphanumeric]: () => CustomValidators.alphanumeric(),
		[ValidatorNames.Email]: () => CustomValidators.email(),
		[ValidatorNames.CopyValueToRootControl]: (arg: string) => CustomValidators.copyValueToRootControl(arg),
		[ValidatorNames.CustomPattern]: (args: string[]) => CustomValidators.customPattern([...args]),
		[ValidatorNames.DateNotExceed]: (args: { sibling: string; months: number }) =>
			CustomValidators.dateNotExceed(args.sibling, args.months),
		[ValidatorNames.Defined]: () => CustomValidators.defined(),
		[ValidatorNames.DisableIfEquals]: (args: { sibling: string; value: unknown }) =>
			CustomValidators.disableIfEquals(args.sibling, args.value),
		[ValidatorNames.EnableIfEquals]: (args: { sibling: string; value: unknown }) =>
			CustomValidators.enableIfEquals(args.sibling, args.value),
		[ValidatorNames.FutureDate]: () => CustomValidators.futureDate,
		[ValidatorNames.PastYear]: () => CustomValidators.pastYear,
		[ValidatorNames.HideIfEmpty]: (args: string) => CustomValidators.hideIfEmpty(args),
		[ValidatorNames.HideIfNotEqual]: (args: { sibling: string; value: unknown }) =>
			CustomValidators.hideIfNotEqual(args.sibling, args.value),
		[ValidatorNames.HideIfParentSiblingEqual]: (args: { sibling: string; value: unknown }) =>
			CustomValidators.hideIfParentSiblingEquals(args.sibling, args.value),
		[ValidatorNames.HideIfParentSiblingNotEqual]: (args: { sibling: string; value: unknown }) =>
			CustomValidators.hideIfParentSiblingNotEqual(args.sibling, args.value),
		[ValidatorNames.Max]: (args: number) => Validators.max(args),
		[ValidatorNames.MaxLength]: (args: number) => Validators.maxLength(args),
		[ValidatorNames.Min]: (args: number) => Validators.min(args),
		[ValidatorNames.MinLength]: (args: number) => Validators.minLength(args),
		[ValidatorNames.NotZNumber]: () => CustomValidators.notZNumber,
		[ValidatorNames.Numeric]: () => CustomValidators.numeric(),
		[ValidatorNames.PastDate]: () => CustomValidators.pastDate,
		[ValidatorNames.Pattern]: (args: string) => Validators.pattern(args),
		[ValidatorNames.Required]: () => Validators.required,
		[ValidatorNames.RequiredIfEquals]: (args: { sibling: string; value: unknown[]; customErrorMessage?: string }) =>
			CustomValidators.requiredIfEquals(args.sibling, args.value, args.customErrorMessage),
		[ValidatorNames.requiredIfAllEquals]: (args: { sibling: string; value: unknown[] }) =>
			CustomValidators.requiredIfAllEquals(args.sibling, args.value),
		[ValidatorNames.RequiredIfNotEquals]: (args: { sibling: string; value: unknown[] }) =>
			CustomValidators.requiredIfNotEquals(args.sibling, args.value),
		[ValidatorNames.ValidateVRMTrailerIdLength]: (args: { sibling: string }) =>
			CustomValidators.validateVRMTrailerIdLength(args.sibling),
		[ValidatorNames.ValidateDefectNotes]: () => DefectValidators.validateDefectNotes,
		[ValidatorNames.ValidateProhibitionIssued]: () => DefectValidators.validateProhibitionIssued,
		[ValidatorNames.MustEqualSibling]: (args: { sibling: string }) => CustomValidators.mustEqualSibling(args.sibling),
		[ValidatorNames.HandlePsvPassengersChange]: (args: { passengersOne: string; passengersTwo: string }) =>
			CustomValidators.handlePsvPassengersChange(args.passengersOne, args.passengersTwo),
		[ValidatorNames.IsMemberOfEnum]: (args: {
			enum: Record<string, string>;
			options?: Partial<EnumValidatorOptions>;
		}) => CustomValidators.isMemberOfEnum(args.enum, args.options),
		[ValidatorNames.UpdateFunctionCode]: () => CustomValidators.updateFunctionCode(),
		[ValidatorNames.ShowGroupsWhenEqualTo]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.showGroupsWhenEqualTo(args.values, args.groups),
		[ValidatorNames.HideGroupsWhenEqualTo]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.hideGroupsWhenEqualTo(args.values, args.groups),
		[ValidatorNames.ShowGroupsWhenIncludes]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.showGroupsWhenIncludes(args.values, args.groups),
		[ValidatorNames.HideGroupsWhenIncludes]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.hideGroupsWhenIncludes(args.values, args.groups),
		[ValidatorNames.ShowGroupsWhenExcludes]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.showGroupsWhenExcludes(args.values, args.groups),
		[ValidatorNames.HideGroupsWhenExcludes]: (args: { values: unknown[]; groups: string[] }) =>
			CustomValidators.hideGroupsWhenExcludes(args.values, args.groups),
		[ValidatorNames.AddWarningForAdrField]: (warning: string) => CustomValidators.addWarningForAdrField(warning),
		[ValidatorNames.IsArray]: (args: Partial<IsArrayValidatorOptions>) => CustomValidators.isArray(args),
		[ValidatorNames.Custom]: (...args) => CustomValidators.custom(...args),
		[ValidatorNames.Tc3TestValidator]: (args: { inspectionNumber: number }) => CustomValidators.tc3TestValidator(args),
		[ValidatorNames.RequiredIfNotHidden]: () => CustomValidators.requiredIfNotHidden(),
		[ValidatorNames.DateIsInvalid]: () => CustomValidators.dateIsInvalid,
		[ValidatorNames.MinArrayLengthIfNotEmpty]: (args: { minimumLength: number; message: string }) =>
			CustomValidators.minArrayLengthIfNotEmpty(args.minimumLength, args.message),
		[ValidatorNames.IssueRequired]: () => CustomValidators.issueRequired(),
		[ValidatorNames.SetBodyDeclarationVisibility]: () => AdrValidators.setBodyDeclarationVisibility(),
		[ValidatorNames.XYearsAfterCurrent]: (xYears: number) => CustomValidators.xYearsAfterCurrent(xYears),
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	asyncValidatorMap: Record<AsyncValidatorNames, (args: any) => AsyncValidatorFn> = {
		[AsyncValidatorNames.HideIfEqualsWithCondition]: (args: {
			sibling: string;
			value: string;
			conditions: Condition | Condition[];
		}) => CustomAsyncValidators.hideIfEqualsWithCondition(this.store, args.sibling, args.value, args.conditions),
		[AsyncValidatorNames.PassResultDependantOnCustomDefects]: () =>
			CustomAsyncValidators.passResultDependantOnCustomDefects(this.store),
		[AsyncValidatorNames.RequiredIfNotAbandoned]: () => CustomAsyncValidators.requiredIfNotAbandoned(this.store),
		[AsyncValidatorNames.RequiredIfNotFail]: () => CustomAsyncValidators.requiredIfNotFail(this.store),
		[AsyncValidatorNames.RequiredIfNotResult]: (args: { testResult: resultOfTestEnum | resultOfTestEnum[] }) =>
			CustomAsyncValidators.requiredIfNotResult(this.store, args.testResult),
		[AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals]: (args: {
			testResult: resultOfTestEnum | resultOfTestEnum[];
			sibling: string;
			value: unknown;
		}) =>
			CustomAsyncValidators.requiredIfNotResultAndSiblingEquals(this.store, args.testResult, args.sibling, args.value),
		[AsyncValidatorNames.ResultDependantOnCustomDefects]: () =>
			CustomAsyncValidators.resultDependantOnCustomDefects(this.store),
		[AsyncValidatorNames.ResultDependantOnRequiredStandards]: () =>
			CustomAsyncValidators.resultDependantOnRequiredStandards(this.store),
		[AsyncValidatorNames.UpdateTesterDetails]: () => CustomAsyncValidators.updateTesterDetails(this.store),
		[AsyncValidatorNames.UpdateTestStationDetails]: () => CustomAsyncValidators.updateTestStationDetails(this.store),
		[AsyncValidatorNames.RequiredWhenCarryingDangerousGoods]: () =>
			CustomAsyncValidators.requiredWhenCarryingDangerousGoods(this.store),
		[AsyncValidatorNames.FilterEuCategoryOnVehicleType]: () =>
			CustomAsyncValidators.filterEuCategoryOnVehicleType(this.technicalRecordService, this.routerService),
		[AsyncValidatorNames.Custom]: (...args) => CustomAsyncValidators.custom(this.store, ...args),
		[AsyncValidatorNames.AsyncRequired]: () => CustomAsyncValidators.asyncRequired(),
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createForm(formNode: FormNode, data?: any): CustomFormGroup | CustomFormArray {
		if (!formNode) {
			return new CustomFormGroup(formNode, {});
		}

		const form: CustomFormGroup | CustomFormArray =
			formNode.type === FormNodeTypes.ARRAY
				? new CustomFormArray(formNode, [], this.store, this.technicalRecordService, this.routerService)
				: new CustomFormGroup(formNode, {});

		data = data ?? (formNode.type === FormNodeTypes.ARRAY ? [] : {});

		formNode.children?.forEach((child) => {
			const { name, type, value, validators, asyncValidators, disabled } = child;

			const control =
				FormNodeTypes.CONTROL === type
					? new CustomFormControl({ ...child }, { value, disabled: !!disabled })
					: this.createForm(child, data[`${name}`]);

			if (validators?.length) {
				this.addValidators(control, validators);
			}

			if (asyncValidators?.length) {
				this.addAsyncValidators(control, asyncValidators);
			}

			if (form instanceof FormGroup) {
				form.addControl(name, control);
			} else if (form instanceof FormArray) {
				this.createControls(child, data).forEach((element) => form.push(element));
			}
		});

		if (data) {
			form.patchValue(data);
		}

		return form;
	}

	createControls(child: FormNode, data: unknown): CustomFormFields[] {
		// Note: There's a quirk here when dealing with arrays where if
		// `data` is an array then `child.name` should be a correct index so
		// make sure the template has the correct name to the node.
		return Array.isArray(data)
			? data.map(() =>
					FormNodeTypes.CONTROL !== child.type
						? this.createForm(child, data[Number(child.name)])
						: new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })
				)
			: [new CustomFormControl({ ...child }, { value: child.value, disabled: !!child.disabled })];
	}

	addValidators(control: CustomFormFields, validators: Array<{ name: ValidatorNames; args?: unknown }> = []) {
		validators.forEach((v) => control.addValidators(this.validatorMap[v.name](v.args)));
	}

	addAsyncValidators(control: CustomFormFields, validators: Array<{ name: AsyncValidatorNames; args?: unknown }> = []) {
		validators.forEach((v) => control.addAsyncValidators(this.asyncValidatorMap[v.name](v.args)));
	}

	static validate(
		form: CustomFormGroup | CustomFormArray | FormGroup | FormArray,
		errors: GlobalError[],
		updateValidity = true
	) {
		this.getFormLevelErrors(form, errors);
		Object.entries(form.controls).forEach(([, value]) => {
			if (!(value instanceof FormControl || value instanceof CustomFormControl)) {
				this.validate(value as CustomFormGroup | CustomFormArray, errors, updateValidity);
			} else {
				value.markAsTouched();
				if (updateValidity) {
					value.updateValueAndValidity();
				}
				(value as CustomFormControl).meta?.changeDetection?.detectChanges();
				this.getControlErrors(value, errors);
			}
		});
	}

	static getFormLevelErrors(form: CustomFormGroup | CustomFormArray | FormGroup | FormArray, errors: GlobalError[]) {
		if (!(form instanceof CustomFormGroup || form instanceof CustomFormArray)) {
			return;
		}
		if (form.errors) {
			Object.entries(form.errors).forEach(([key, error]) => {
				// If an anchor link is provided, use that, otherwise determine target element from customId or name
				const anchorLink = form.meta?.customId ?? form.meta?.name;
				errors.push({
					error: ErrorMessageMap[`${key}`](error),
					anchorLink,
				});
			});
		}
	}

	static validateControl(control: FormControl | CustomFormControl, errors: GlobalError[]) {
		control.markAsTouched();
		(control as CustomFormControl).meta?.changeDetection?.detectChanges();
		this.getControlErrors(control, errors);
	}

	private static getControlErrors(control: FormControl | CustomFormControl, validationErrorList: GlobalError[]) {
		const { errors } = control;
		const meta = (control as CustomFormControl).meta as FormNode | undefined;

		if (errors) {
			if (meta?.hide) return;
			Object.entries(errors).forEach(([error, data]) => {
				// If an anchor link is provided, use that, otherwise determine target element from customId or name
				const defaultAnchorLink = meta?.customId ?? meta?.name;
				const anchorLink =
					typeof data === 'object' && data !== null ? (data.anchorLink ?? defaultAnchorLink) : defaultAnchorLink;

				// If typeof data is an array, assume we're passing the service multiple global errors
				const globalErrors = Array.isArray(data)
					? data
					: [
							{
								error:
									meta?.customErrorMessage ??
									ErrorMessageMap[`${error}`](data, meta?.customValidatorErrorName ?? meta?.label),
								anchorLink,
							},
						];

				validationErrorList.push(...globalErrors);
			});
		}
	}
}
