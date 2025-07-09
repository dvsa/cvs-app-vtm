import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { clearError } from '@store/global-error/global-error.actions';
import { initialAppState } from '@store/index';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { BehaviorSubject, ReplaySubject, map, of } from 'rxjs';
import { EditTechRecordButtonComponent } from '../edit-tech-record-button.component';

const mockTechRecordService = {
	techRecord$: of({
		systemNumber: 'foo',
		createdTimestamp: 'bar',
		vin: 'testVin',
		techRecord_statusCode: StatusCodes.CURRENT,
	} as V3TechRecordModel),
	clearReasonForCreation: jest.fn(),
};

let component: EditTechRecordButtonComponent;
let fixture: ComponentFixture<EditTechRecordButtonComponent>;
let router: Router;
let store: MockStore;
let actions$: ReplaySubject<Action>;
const mockTechnicalRecordObservable = new BehaviorSubject({
	techRecord_statusCode: StatusCodes.CURRENT,
} as V3TechRecordModel);
const updateMockTechnicalRecord = (techRecord_statusCode: StatusCodes) =>
	mockTechnicalRecordObservable.next({ techRecord_statusCode } as V3TechRecordModel);

const mockRouterService = {
	getRouteNestedParam$: () => '1',
	getRouteDataProperty$: () => false,
};

describe('EditTechRecordButtonComponent', () => {
	beforeEach(async () => {
		actions$ = new ReplaySubject<Action>();

		jest.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [EditTechRecordButtonComponent],
			providers: [
				{ provide: RouterService, useValue: mockRouterService },
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: APP_BASE_HREF, useValue: '/' },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditTechRecordButtonComponent);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;

		fixture.detectChanges();

		jest.spyOn(window, 'confirm');
	});

	describe('component', () => {
		it('should create', () => {
			expect(component).toBeTruthy();
		});
	});

	describe('when viewing a tech record', () => {
		afterAll(() => {
			mockTechRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_statusCode: StatusCodes.CURRENT,
			} as unknown as V3TechRecordModel);
		});
		it.each([
			[
				'should be viewable',
				true,
				{
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_statusCode: StatusCodes.PROVISIONAL,
				} as V3TechRecordModel,
			],
			[
				'should be viewable',
				true,
				{
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_statusCode: StatusCodes.CURRENT,
				} as V3TechRecordModel,
			],
			[
				'should not be viewable',
				false,
				{
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_statusCode: StatusCodes.ARCHIVED,
				} as V3TechRecordModel,
			],
		])('edit button %s for %s record', (isViewable: string, expected: boolean, record: V3TechRecordModel) => {
			component.isArchived$ = of(record).pipe(
				map(
					(techRecord) =>
						!(
							techRecord?.techRecord_statusCode === StatusCodes.CURRENT ||
							techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL
						)
				)
			);

			fixture.detectChanges();

			const button = fixture.debugElement.query(By.css('#edit'));
			expect(Boolean(button)).toEqual(expected);
		});
	});

	describe('when user clicks edit button', () => {
		it('component should navigate away for current amendments', () => {
			mockTechRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_statusCode: StatusCodes.PROVISIONAL,
			} as V3TechRecordModel);
			const navigateSpy = jest.spyOn(router, 'navigate');
			jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

			fixture.detectChanges();
			fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

			expect(navigateSpy).toHaveBeenCalledWith(['notifiable-alteration-needed'], { relativeTo: expect.anything() });
		});
		it('component should navigate away for notifiable alterations', () => {
			mockTechRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_statusCode: StatusCodes.CURRENT,
			} as V3TechRecordModel);
			const navigateSpy = jest.spyOn(router, 'navigate');

			fixture.detectChanges();
			fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

			expect(navigateSpy).toHaveBeenCalledWith(['amend-reason'], { relativeTo: expect.anything() });
		});
	});

	describe('when amending a provisional tech record', () => {
		beforeEach(() => {
			component.isEditing.set(true);
		});
		describe('and the user submits their changes', () => {
			it('component should emit event', fakeAsync(() => {
				const sumbitChangeSpy = jest.spyOn(component.submitChange, 'emit');

				fixture.detectChanges();
				fixture.debugElement.query(By.css('button#submit')).nativeElement.click();
				discardPeriodicTasks();

				expect(sumbitChangeSpy).toHaveBeenCalledTimes(1);
			}));
		});
	});

	describe('when amending a current tech record', () => {
		beforeEach(() => {
			updateMockTechnicalRecord(StatusCodes.CURRENT);
			component.isEditing.set(true);
		});
		describe('and the user submits their changes', () => {
			it('component should emit event', fakeAsync(() => {
				const sumbitChangeSpy = jest.spyOn(component.submitChange, 'emit');

				fixture.detectChanges();
				fixture.debugElement.query(By.css('button#submit')).nativeElement.click();
				discardPeriodicTasks();

				expect(sumbitChangeSpy).toHaveBeenCalledTimes(1);
			}));
		});

		describe('and the user cancels their changes', () => {
			describe('and the form is dirty', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('isDirty', true);
					jest.resetAllMocks();
				});

				it('should prompt user if they wish to cancel', () => {
					fixture.componentRef.setInput('isEditing', true);
					jest.spyOn(window, 'confirm').mockImplementation(() => true);

					fixture.detectChanges();

					fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

					expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
				});

				describe('and the user cancels cancelling an amendment', () => {
					it('should keep user in edit view', fakeAsync(() => {
						fixture.componentRef.setInput('isEditing', true);
						jest.spyOn(window, 'confirm').mockImplementation(() => false);
						const dispatchSpy = jest.spyOn(store, 'dispatch');
						const cancelSpy = jest.spyOn(component, 'cancel');
						const toggleEditModeSpy = jest.spyOn(component, 'toggleEditMode');
						const navigateSpy = jest.spyOn(router, 'navigate');

						fixture.detectChanges();
						fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

						discardPeriodicTasks();

						expect(cancelSpy).toHaveBeenCalled();
						expect(toggleEditModeSpy).not.toHaveBeenCalled();
						expect(component.isEditingChange).toBeTruthy();
						expect(window.confirm).toHaveBeenCalledTimes(1);
						expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
						expect(navigateSpy).not.toHaveBeenCalled();
						expect(dispatchSpy).not.toHaveBeenCalled();
						expect(navigateSpy).not.toHaveBeenCalled();
					}));
				});

				describe('and the user confirms cancelling the amendment', () => {
					it('should return user back to non-edit view', fakeAsync(() => {
						fixture.componentRef.setInput('isEditing', true);
						jest.spyOn(window, 'confirm').mockImplementation(() => true);
						const dispatchSpy = jest.spyOn(store, 'dispatch');
						const cancelSpy = jest.spyOn(component, 'cancel');
						const toggleEditModeSpy = jest.spyOn(component, 'toggleEditMode');
						const navigateSpy = jest.spyOn(router, 'navigate');

						fixture.detectChanges();
						fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

						discardPeriodicTasks();

						expect(navigateSpy).toHaveBeenCalled();
						expect(cancelSpy).toHaveBeenCalled();
						expect(toggleEditModeSpy).toHaveBeenCalled();
						expect(component.isEditing()).toBeFalsy();
						expect(window.confirm).toHaveBeenCalledTimes(1);
						expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
						expect(dispatchSpy).toHaveBeenNthCalledWith(1, clearError());
						expect(dispatchSpy).toHaveBeenNthCalledWith(2, updateEditingTechRecordCancel());
					}));
				});
			});

			describe('and the form is not dirty', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('isDirty', false);
				});

				it('should not prompt user if they wish to cancel', fakeAsync(() => {
					fixture.componentRef.setInput('isEditing', true);
					jest.spyOn(window, 'confirm');
					fixture.detectChanges();

					fixture.debugElement.query(By.css('#cancel')).nativeElement.click();
					discardPeriodicTasks();
					expect(window.confirm).not.toHaveBeenCalled();
				}));

				it('should return user to non-edit view', fakeAsync(() => {
					fixture.componentRef.setInput('isEditing', true);
					jest.spyOn(window, 'confirm');
					const cancelSpy = jest.spyOn(component, 'cancel');
					const toggleSpy = jest.spyOn(component, 'toggleEditMode');
					const dispatchSpy = jest.spyOn(store, 'dispatch');

					fixture.detectChanges();

					fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

					discardPeriodicTasks();

					expect(cancelSpy).toHaveBeenCalled();
					expect(toggleSpy).toHaveBeenCalled();
					expect(component.isEditing()).toBeFalsy();
					expect(dispatchSpy).toHaveBeenNthCalledWith(1, clearError());
					expect(dispatchSpy).toHaveBeenNthCalledWith(2, updateEditingTechRecordCancel());
				}));
			});
		});
	});
});
