import { AbstractControl, AsyncValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { Data } from '@angular/router';
import { Condition, operatorEnum } from '@models/condition.model';
import {
	ALL_EU_VEHICLE_CATEGORY_OPTIONS,
	CAR_EU_VEHICLE_CATEGORY_OPTIONS,
	LGV_EU_VEHICLE_CATEGORY_OPTIONS,
	SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_EU_VEHICLE_CATEGORY_OPTIONS,
} from '@models/options.model';
import { User } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestStation } from '@models/test-stations/test-station.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
// eslint-disable-next-line import/no-cycle
import { CustomFormControl } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { selectUserByResourceKey } from '@store/reference-data';
import { editingTechRecord } from '@store/technical-records';
import { testResultInEdit } from '@store/test-records';
import { getTestStationFromProperty } from '@store/test-stations';
import { Observable, catchError, combineLatestWith, map, of, skipWhile, take, tap } from 'rxjs';

export class CustomAsyncValidators {
	static resultDependantOnCustomDefects(store: Store<State>): AsyncValidatorFn {
		return CustomAsyncValidators.checkResultDependantOnCustomDefects(store, [
			resultOfTestEnum.pass,
			resultOfTestEnum.fail,
			resultOfTestEnum.prs,
		]);
	}

	static resultDependantOnRequiredStandards(store: Store<State>): AsyncValidatorFn {
		return CustomAsyncValidators.checkResultDependantOnRequiredStandards(store, [
			resultOfTestEnum.pass,
			resultOfTestEnum.fail,
			resultOfTestEnum.prs,
		]);
	}

	static passResultDependantOnCustomDefects(store: Store<State>): AsyncValidatorFn {
		return CustomAsyncValidators.checkResultDependantOnCustomDefects(store, resultOfTestEnum.pass);
	}

	static checkResultDependantOnCustomDefects(
		store: Store<State>,
		limitToResult: resultOfTestEnum | resultOfTestEnum[]
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> =>
			store.pipe(
				take(1),
				select(testResultInEdit),
				map((testResult) => {
					const hasCustomDefects = testResult?.testTypes?.some(
						(testType) => testType?.customDefects && testType.customDefects.length > 0
					);

					if (
						control.value === 'pass' &&
						hasCustomDefects &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.pass)
							: limitToResult === resultOfTestEnum.pass)
					) {
						return { invalidTestResult: { message: 'Cannot pass test when defects are present' } };
					}
					if (
						control.value === 'fail' &&
						!hasCustomDefects &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.fail)
							: limitToResult === resultOfTestEnum.fail)
					) {
						return { invalidTestResult: { message: 'Cannot fail test when no defects are present' } };
					}
					if (
						control.value === 'prs' &&
						!hasCustomDefects &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.prs)
							: limitToResult === resultOfTestEnum.prs)
					) {
						return { invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } };
					}
					return null;
				})
			);
	}

	static checkResultDependantOnRequiredStandards(
		store: Store<State>,
		limitToResult: resultOfTestEnum | resultOfTestEnum[]
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> =>
			store.pipe(
				take(1),
				select(testResultInEdit),
				map((testResult) => {
					const hasRequiredStandards = testResult?.testTypes?.some(
						(testType) => testType?.requiredStandards && testType.requiredStandards.length > 0
					);

					if (
						control.value === 'pass' &&
						hasRequiredStandards &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.pass)
							: limitToResult === resultOfTestEnum.pass)
					) {
						return { invalidTestResult: { message: 'Cannot pass test when required standards are present' } };
					}
					if (
						control.value === 'fail' &&
						!hasRequiredStandards &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.fail)
							: limitToResult === resultOfTestEnum.fail)
					) {
						return { invalidTestResult: { message: 'Cannot fail test when no required standards are present' } };
					}
					if (
						control.value === 'prs' &&
						!hasRequiredStandards &&
						(!limitToResult || Array.isArray(limitToResult)
							? limitToResult.includes(resultOfTestEnum.prs)
							: limitToResult === resultOfTestEnum.prs)
					) {
						return { invalidTestResult: { message: 'Cannot mark test as PRS when no required standards are present' } };
					}
					return null;
				})
			);
	}

	static updateTestStationDetails(store: Store<State>): AsyncValidatorFn {
		return (control: AbstractControl): Observable<null> => {
			return store.pipe(
				select(
					getTestStationFromProperty((control as CustomFormControl).meta.name as keyof TestStation, control.value)
				),
				take(1),
				tap((stations) => {
					const testStationName = control.parent?.get('testStationName');
					const testStationType = control.parent?.get('testStationType');
					if (stations) {
						if (testStationName) {
							testStationName.setValue(stations.testStationName, { emitEvent: true, onlySelf: true });
						}
						if (testStationType) {
							testStationType.setValue(stations.testStationType, { emitEvent: true, onlySelf: true });
						}
					}
				}),
				map(() => null),
				catchError(() => of(null))
			);
		};
	}

	static updateTesterDetails(store: Store<State>): AsyncValidatorFn {
		return (control: AbstractControl): Observable<null> => {
			return store.pipe(
				select(selectUserByResourceKey(control.value)),
				take(1),
				tap((user) => {
					const testerName = control.parent?.get('testerName');
					const testerEmail = control.parent?.get('testerEmailAddress');
					if (user && testerName && testerEmail) {
						testerName.setValue((user as User).name, { emitEvent: false, onlySelf: true });
						testerEmail.setValue((user as User).email, { emitEvent: false, onlySelf: true });
					}
				}),
				map(() => null),
				catchError(() => of(null))
			);
		};
	}

	static requiredIfNotResult(store: Store<State>, result: resultOfTestEnum | resultOfTestEnum[]): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> =>
			store.pipe(
				take(1),
				select(testResultInEdit),
				map((testResult) => {
					const currentResult = testResult?.testTypes[0].testResult;
					if (
						(Array.isArray(result) ? currentResult && !result.includes(currentResult) : currentResult !== result) &&
						(control.value == null || control.value === '')
					) {
						if (Array.isArray(result)) return { requiredIfNotResult: true };
						return { [`requiredIfNot${result}`]: true };
					}
					return null;
				})
			);
	}

	static asyncRequired(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return control.value === null || control.value === undefined || control.value === ''
				? of({ required: true })
				: of(null);
		};
	}

	static filterEuCategoryOnVehicleType(
		technicalRecordService: TechnicalRecordService,
		routerService: RouterService
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return technicalRecordService.techRecord$.pipe(
				skipWhile((techRecord) => !techRecord),
				take(1),
				combineLatestWith(routerService.routeData$),
				skipWhile((routeData) => !routeData),
				take(1),
				map(([techRecord, routeData]: [V3TechRecordModel | undefined, Data]) => {
					if (!techRecord) return null;
					const vehicleType = technicalRecordService.getVehicleTypeWithSmallTrl(techRecord);
					if (!(control instanceof CustomFormControl)) return null;

					switch (vehicleType) {
						case VehicleTypes.CAR:
							control.meta.options = CAR_EU_VEHICLE_CATEGORY_OPTIONS;
							if (routeData['mode'] === 'create') {
								control.disable();
							}
							break;
						case VehicleTypes.TRL:
							control.meta.options = TRL_EU_VEHICLE_CATEGORY_OPTIONS;
							break;
						case VehicleTypes.LGV:
							control.meta.options = LGV_EU_VEHICLE_CATEGORY_OPTIONS;
							if (routeData['mode'] === 'create') {
								control.disable();
							}
							break;
						case VehicleTypes.SMALL_TRL:
							control.meta.options = SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS;
							break;
						// TODO uncomment these to enable HGV and PSV filtering
						// case VehicleTypes.HGV:
						//   control.meta.options = HGV_EU_VEHICLE_CATEGORY_OPTIONS;
						//   break;
						// case VehicleTypes.PSV:
						//   control.meta.options = PSV_EU_VEHICLE_CATEGORY_OPTIONS;
						//   break;
						default:
							control.meta.options = ALL_EU_VEHICLE_CATEGORY_OPTIONS;
							break;
					}

					control.markAsDirty({ onlySelf: true });
					control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
					control.meta.changeDetection?.detectChanges();

					return null;
				})
			);
		};
	}

	static requiredIfNotFail(store: Store<State>): AsyncValidatorFn {
		return this.requiredIfNotResult(store, resultOfTestEnum.fail);
	}

	static requiredIfNotAbandoned(store: Store<State>): AsyncValidatorFn {
		return this.requiredIfNotResult(store, resultOfTestEnum.abandoned);
	}

	static requiredIfNotResultAndSiblingEquals(
		store: Store<State>,
		result: resultOfTestEnum | resultOfTestEnum[],
		sibling: string,
		value: unknown
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> =>
			store.pipe(
				take(1),
				select(testResultInEdit),
				map((testResult) => {
					if (control?.parent) {
						const siblingControl = control.parent.get(sibling) as CustomFormControl;
						const siblingValue = siblingControl.value;
						const newValue = Array.isArray(value) ? value.includes(siblingValue) : siblingValue === value;

						const currentResult = testResult?.testTypes[0].testResult;

						if (
							(Array.isArray(result) ? currentResult && !result.includes(currentResult) : currentResult !== result) &&
							newValue &&
							(control.value === null || control.value === undefined || control.value === '')
						) {
							return { requiredIfNotResultAndSiblingEquals: true };
						}
					}

					return null;
				})
			);
	}

	static hideIfEqualsWithCondition(
		store: Store<State>,
		sibling: string,
		value: string,
		conditions: Condition | Condition[]
	): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> =>
			store.pipe(
				take(1),
				select(testResultInEdit),
				map((testResult) => {
					if (!testResult || !control?.parent) {
						return null;
					}

					const siblingControl = control.parent.get(sibling) as CustomFormControl;

					const conditionsPassed = CustomAsyncValidators.checkConditions(testResult, conditions);

					siblingControl.meta.hide =
						conditionsPassed && (Array.isArray(value) ? value.includes(control.value) : control.value === value);

					return null;
				})
			);
	}

	static requiredWhenCarryingDangerousGoods = (store: Store<State>) => {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return store.select(editingTechRecord).pipe(
				take(1),
				map((form) => {
					if (
						form &&
						(form.techRecord_vehicleType === 'hgv' || form.techRecord_vehicleType === 'trl') &&
						form.techRecord_adrDetails_dangerousGoods
					) {
						return Validators.required(control);
					}

					return null;
				})
			);
		};
	};

	private static checkConditions(testResult: TestResultModel, conditions: Condition | Condition[]) {
		if (!Array.isArray(conditions)) {
			return CustomAsyncValidators.checkCondition(testResult, conditions);
		}

		return conditions.every((condition) => CustomAsyncValidators.checkCondition(testResult, condition));
	}

	private static checkCondition(testResult: TestResultModel, condition: Condition) {
		const { field, operator, value } = condition;

		// eslint-disable-next-line no-prototype-builtins
		const fieldValue = testResult.testTypes[0].hasOwnProperty(field)
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any, security/detect-object-injection
				(testResult.testTypes[0] as any)[field]
			: testResult[field as keyof TestResultModel];

		const isTrue = Array.isArray(value) ? value.includes(fieldValue) : fieldValue === value;

		return operator === operatorEnum.Equals ? isTrue : !isTrue;
	}

	static custom = (
		store: Store<State>,
		func: (...args: unknown[]) => Observable<ValidationErrors | null>,
		...args: unknown[]
	) => {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return func(control, store, ...args);
		};
	};
}
