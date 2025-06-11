import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';

describe('EditBaseComponent', () => {
	let component: EditBaseComponent;
	let fixture: ComponentFixture<EditBaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideMockStore({ initialState: initialAppState }),
				ControlContainer,
				FormBuilder,
				TechnicalRecordService,
				CommonValidatorsService,
			],
			imports: [EditBaseComponent, HttpClientTestingModule, RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditBaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
