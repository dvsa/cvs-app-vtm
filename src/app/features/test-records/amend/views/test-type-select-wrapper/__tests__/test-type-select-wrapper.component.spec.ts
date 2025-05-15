import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TestType } from '@models/test-types/testType';
import { provideMockStore } from '@ngrx/store/testing';
import { TestTypesService } from '@services/test-types/test-types.service';
import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { TestTypeSelectComponent } from '../../../../components/test-type-select/test-type-select.component';
import { TestTypeSelectWrapperComponent } from '../test-type-select-wrapper.component';

describe('TestTypeSelectWrapperComponent', () => {
	let component: TestTypeSelectWrapperComponent;
	let fixture: ComponentFixture<TestTypeSelectWrapperComponent>;
	let router: Router;
	let route: ActivatedRoute;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestTypeSelectWrapperComponent, TestTypeSelectComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: TestTypesService, useValue: { selectAllTestTypes$: of([]), testTypeIdChanged: () => {} } },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestTypeSelectWrapperComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate to sibling path "amend-test-details"', () => {
		const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
		component.handleTestTypeSelection({ id: '1' } as TestType);
		expect(navigateSpy).toHaveBeenCalledWith(['..', 'amend-test-details'], {
			queryParams: { testType: '1' },
			queryParamsHandling: 'merge',
			relativeTo: route,
		});
	});
});
