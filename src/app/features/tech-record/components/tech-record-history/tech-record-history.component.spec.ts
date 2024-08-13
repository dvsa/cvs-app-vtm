import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { TechRecordHistoryComponent } from './tech-record-history.component';

describe('TechRecordHistoryComponent', () => {
	let component: TechRecordHistoryComponent;
	let fixture: ComponentFixture<TechRecordHistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TechRecordHistoryComponent],
			imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
			providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordHistoryComponent);
		component = fixture.componentInstance;
		component.currentTechRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
