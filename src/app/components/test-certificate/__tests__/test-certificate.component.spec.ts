import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { HttpService } from '@services/http/http.service';
import { State, initialAppState } from '@store/index';
import { isTestTypeOldIvaOrMsva, toEditOrNotToEdit } from '@store/test-records';
import { TestCertificateComponent } from '../test-certificate.component';

describe('TestCertificateComponent', () => {
	let component: TestCertificateComponent;
	let fixture: ComponentFixture<TestCertificateComponent>;
	let store: MockStore<State>;
	let featureToggleService: FeatureToggleService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RetrieveDocumentDirective, TestCertificateComponent],
			providers: [
				HttpService,
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				FeatureToggleService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestCertificateComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(MockStore);
		featureToggleService = TestBed.inject(FeatureToggleService);
		fixture.componentRef.setInput('testNumber', 'testNumber');
		fixture.componentRef.setInput('vin', 'vin');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		beforeEach(() => {
			jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);
		});
		it('should set certNotNeeded to false if test type is not an iva or msva test', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: TestResults.PASS, testTypeId: '94' }],
			} as TestResultSchema);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(false);
		});

		it('should set certNotNeeded to true if test type is an old iva or msva test', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: TestResults.PASS, testTypeId: '125' }],
			} as TestResultSchema);
			store.overrideSelector(isTestTypeOldIvaOrMsva, true);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to true if test type is an new iva or msva test and the test is a pass', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: TestResults.PASS, testTypeId: '125' }],
			} as TestResultSchema);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to true if test type is an new iva or msva test and the test is a prs', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: TestResults.PRS, testTypeId: '125' }],
			} as TestResultSchema);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to false if test type is an new iva or msva test and the test is a fail', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: TestResults.FAIL, testTypeId: '125' }],
			} as TestResultSchema);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(false);
		});

		it('should not change certNotNeeded value if no test result is found', () => {
			component.certNotNeeded = false;
			store.overrideSelector(toEditOrNotToEdit, undefined);
			store.overrideSelector(isTestTypeOldIvaOrMsva, true);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(false);
		});
	});
});
