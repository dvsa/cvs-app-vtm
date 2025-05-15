import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { TagComponent } from '@components/tag/tag.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/index';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { TestResultSummaryComponent } from '../test-result-summary.component';

describe('TestResultSummaryComponent', () => {
	let component: TestResultSummaryComponent;
	let fixture: ComponentFixture<TestResultSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestResultSummaryComponent, VehicleHeaderComponent, NumberPlateComponent, TagComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				TestRecordsService,
				TechnicalRecordService,
				RouterService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestResultSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
