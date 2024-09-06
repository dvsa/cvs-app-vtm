import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { Roles } from '@models/roles.enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { selectRouteNestedParams } from '@store/router/router.selectors';
import { TechRecordComponent } from '../tech-record.component';

describe('TechRecordComponent', () => {
	let component: TechRecordComponent;
	let fixture: ComponentFixture<TechRecordComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule],
			declarations: [TechRecordComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectRouteNestedParams, { vin: '123456' });

		fixture = TestBed.createComponent(TechRecordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return roles', () => {
		const { roles } = component;

		expect(roles).toBe(Roles);
	});

	it('should return error', () => {
		const expectedError: GlobalError = { error: 'some error', anchorLink: 'expected' };

		const expectedResult = component.getErrorByName([expectedError], expectedError.anchorLink ?? '');

		expect(expectedResult).toBe(expectedError);
	});

	it('reuse strategy should be set to false', () => {
		const snapshot = {} as ActivatedRouteSnapshot;

		const expectedResult = component['router'].routeReuseStrategy.shouldReuseRoute(snapshot, snapshot);

		expect(expectedResult).toBeFalsy();
	});
});
