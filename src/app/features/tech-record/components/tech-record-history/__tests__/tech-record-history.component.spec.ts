import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { initialAppState } from '@store/index';
import { TechRecordHistoryComponent } from '../tech-record-history.component';

describe('TechRecordHistoryComponent', () => {
	let component: TechRecordHistoryComponent;
	let fixture: ComponentFixture<TechRecordHistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordHistoryComponent],
			providers: [
				TechnicalRecordService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordHistoryComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('currentTechRecord', {
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
		} as V3TechRecordModel);
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
