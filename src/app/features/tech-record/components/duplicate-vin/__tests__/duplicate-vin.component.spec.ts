import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DuplicateVinComponent } from '@features/tech-record/components/duplicate-vin/duplicate-vin.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { editingTechRecord } from '@store/technical-records';
import { of } from 'rxjs';

let component: DuplicateVinComponent;
let fixture: ComponentFixture<DuplicateVinComponent>;
let router: Router;
let store: MockStore;

const hgvTechRecord: TechRecordType<'hgv', 'put'> = {
	techRecord_vehicleType: 'hgv',
	partialVin: '',
	techRecord_bodyType_description: '',
	techRecord_noOfAxles: 2,
	techRecord_reasonForCreation: 'test',
	techRecord_statusCode: 'provisional',
	techRecord_vehicleClass_description: 'heavy goods vehicle',
	primaryVrm: '',
	vin: '',
	techRecord_adrDetails_dangerousGoods: false,
};

describe('DuplicateVinComponent', () => {
	beforeEach(async () => {
		jest.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [DuplicateVinComponent],
			providers: [
				GlobalErrorService,
				provideRouter([{ path: 'create/new-record-details', component: jest.fn() }]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DuplicateVinComponent);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;

		store.overrideSelector(editingTechRecord, hgvTechRecord);

		fixture.detectChanges();
	});

	describe('component', () => {
		it('should create', () => {
			expect(component).toBeTruthy();
		});
	});

	describe('onSubmit', () => {
		it('should navigate to new record details on submit', fakeAsync(() => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.onSubmit();
			expect(navigateSpy).toHaveBeenCalledWith(['../create/new-record-details']);
		}));
	});

	describe('onNavigateBack', () => {
		it('should navigate back to the previous route', fakeAsync(() => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.onNavigateBack();
			fixture.detectChanges();
			discardPeriodicTasks();
			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: component.route });
		}));
	});
});
