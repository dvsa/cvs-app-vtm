import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TagComponent } from '@shared/components/tag/tag.component';
import { TruncatePipe } from '@shared/pipes/truncate/truncate.pipe';
import { initialAppState } from '@store/index';
import { RequiredStandardsComponent } from './required-standards.component';

describe('RequiredStandardsComponent', () => {
	let component: RequiredStandardsComponent;
	let fixture: ComponentFixture<RequiredStandardsComponent>;
	let el: DebugElement;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
			declarations: [RequiredStandardsComponent, ButtonComponent, TruncatePipe, TagComponent],
			providers: [DynamicFormService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RequiredStandardsComponent);
		router = TestBed.inject(Router);
		component = fixture.componentInstance;
		el = fixture.debugElement;
		jest.clearAllMocks();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render correct header', () => {
		fixture.detectChanges();
		expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Required Standards');
	});

	describe('No required standards', () => {
		it('should be displayed when required standards is undefined or empty array', fakeAsync(() => {
			const expectedText = 'No required standards';

			tick();
			fixture.detectChanges();

			let text: HTMLParagraphElement = el.query(By.css('p')).nativeElement;
			expect(text.innerHTML).toBe(expectedText);

			tick();
			fixture.detectChanges();

			text = el.query(By.css('p')).nativeElement;
			expect(text.innerHTML).toBe(expectedText);
		}));
	});

	describe('onAddRequiredStandards', () => {
		it('should let me add a RS and call the navigator', () => {
			const spy = jest.spyOn(router, 'navigate');

			component.testData = {
				euVehicleCategory: EUVehicleCategory.M1,
			};

			component.onAddRequiredStandard();

			expect(spy).toHaveBeenCalledTimes(1);
		});
		it('should not add a RS and emit a value to the parent', () => {
			const spy = jest.spyOn(router, 'navigate');
			const emitSpy = jest.spyOn(component.validateEuVehicleCategory, 'emit');

			component.testData = {
				testerName: 'bar',
			};

			component.onAddRequiredStandard();

			expect(spy).toHaveBeenCalledTimes(0);
			expect(emitSpy).toHaveBeenCalledTimes(1);
		});
	});
});
