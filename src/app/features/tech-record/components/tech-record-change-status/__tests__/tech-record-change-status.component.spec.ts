import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import {
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	promoteTechRecord,
	promoteTechRecordFailure,
	promoteTechRecordSuccess,
	selectTechRecord,
} from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { TechRecordTitleComponent } from '../../tech-record-title/tech-record-title.component';
import { TechRecordChangeStatusComponent } from '../tech-record-change-status.component';

describe('TechRecordChangeStatusComponent', () => {
	let actions$: ReplaySubject<Action>;
	let component: TechRecordChangeStatusComponent;
	let fixture: ComponentFixture<TechRecordChangeStatusComponent>;
	const record = {
		systemNumber: '12345',
		createdTimestamp: '2026-09-01T12:00:00.000Z',
		techRecord_vehicleType: 'hgv',
		techRecord_statusCode: 'provisional',
	} as TechRecordType<'get'>;

	beforeEach(async () => {
		actions$ = new ReplaySubject<Action>();

		await TestBed.configureTestingModule({
			imports: [TechRecordChangeStatusComponent, TechRecordTitleComponent, ReactiveFormsModule],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: APP_BASE_HREF, useValue: '/' },
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordArchive]),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		TestBed.inject(MockStore).overrideSelector(selectTechRecord, record);
		fixture = TestBed.createComponent(TechRecordChangeStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it.each([true, false])(
		'prevents repeat submissions while changing status (promotion: %s)',
		fakeAsync((isPromotion: boolean) => {
			component.isPromotion = isPromotion;
			component.form.patchValue({ reason: 'Status change reason' });
			const dispatchSpy = jest.spyOn(component.store, 'dispatch');
			const actionType = isPromotion ? promoteTechRecord.type : archiveTechRecord.type;
			const button: HTMLButtonElement = fixture.nativeElement.querySelector('button#submit-change-status');

			button.click();
			fixture.detectChanges();
			tick(1100); // Beyond the shared button directive's one-second click throttle.
			button.click();
			component.handleSubmit(component.form.value);

			expect(dispatchSpy.mock.calls.filter(([action]) => action.type === actionType)).toHaveLength(1);
			expect(button.disabled).toBe(true);
			tick(1100);
		})
	);

	it.each([true, false])(
		'allows retry after a failed status change (promotion: %s)',
		fakeAsync((isPromotion: boolean) => {
			component.isPromotion = isPromotion;
			component.form.patchValue({ reason: 'Status change reason' });
			const dispatchSpy = jest.spyOn(component.store, 'dispatch');
			const actionType = isPromotion ? promoteTechRecord.type : archiveTechRecord.type;
			const button: HTMLButtonElement = fixture.nativeElement.querySelector('button#submit-change-status');

			button.click();
			actions$.next((isPromotion ? promoteTechRecordFailure : archiveTechRecordFailure)({ error: 'Save failed' }));
			fixture.detectChanges();
			expect(button.disabled).toBe(false);
			tick(1100);
			button.click();

			expect(dispatchSpy.mock.calls.filter(([action]) => action.type === actionType)).toHaveLength(2);
			tick(1100);
		})
	);

	it.each([promoteTechRecordSuccess, archiveTechRecordSuccess])(
		'navigates to the saved record after %s',
		(successAction) => {
			const updatedRecord = { ...record, createdTimestamp: '2026-09-18T12:00:00.000Z' };
			const navigateSpy = jest.spyOn(component.router, 'navigate').mockResolvedValue(true);

			actions$.next(successAction({ vehicleTechRecord: updatedRecord }));

			expect(navigateSpy).toHaveBeenCalledWith([
				`/tech-records/${updatedRecord.systemNumber}/${updatedRecord.createdTimestamp}`,
			]);
		}
	);

	it('shows the required reason error without disabling submission', () => {
		component.isPromotion = true;
		const errorsSpy = jest.spyOn(component.errorService, 'setErrors');
		component.handleSubmit(component.form.value);
		fixture.detectChanges();

		expect(errorsSpy).toHaveBeenCalledWith([
			{ error: 'Reason for promotion is required', anchorLink: 'reasonForAmend' },
		]);
		expect(fixture.nativeElement.querySelector('button#submit-change-status').disabled).toBe(false);
	});
});
