import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { DimensionsComponent } from './dimensions.component';

describe('DimensionsComponent', () => {
	let component: DimensionsComponent;
	let fixture: ComponentFixture<DimensionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DimensionsComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DimensionsComponent);
		component = fixture.componentInstance;
		component.techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'hgv'>;
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
