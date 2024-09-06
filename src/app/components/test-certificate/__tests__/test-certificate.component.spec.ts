import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
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
			declarations: [RetrieveDocumentDirective, TestCertificateComponent],
			imports: [HttpClientTestingModule],
			providers: [DocumentRetrievalService, provideMockStore({ initialState: initialAppState }), FeatureToggleService],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestCertificateComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(MockStore);
		featureToggleService = TestBed.inject(FeatureToggleService);
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
				testTypes: [{ testResult: resultOfTestEnum.pass, testTypeId: '94' }],
			} as TestResultModel);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(false);
		});

		it('should set certNotNeeded to true if test type is an old iva or msva test', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: resultOfTestEnum.pass, testTypeId: '125' }],
			} as TestResultModel);
			store.overrideSelector(isTestTypeOldIvaOrMsva, true);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to true if test type is an new iva or msva test and the test is a pass', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: resultOfTestEnum.pass, testTypeId: '125' }],
			} as TestResultModel);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to true if test type is an new iva or msva test and the test is a prs', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: resultOfTestEnum.prs, testTypeId: '125' }],
			} as TestResultModel);
			store.overrideSelector(isTestTypeOldIvaOrMsva, false);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(true);
		});

		it('should set certNotNeeded to false if test type is an new iva or msva test and the test is a fail', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: resultOfTestEnum.fail, testTypeId: '125' }],
			} as TestResultModel);
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

		it('should not certNotNeeded value if requiredStandards feature is false', () => {
			component.certNotNeeded = false;
			jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(false);
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testResult: resultOfTestEnum.pass, testTypeId: '125' }],
			} as TestResultModel);
			store.overrideSelector(isTestTypeOldIvaOrMsva, true);
			component.ngOnInit();

			expect(component.certNotNeeded).toBe(false);
		});
	});
});
