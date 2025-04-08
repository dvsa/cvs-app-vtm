import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { AdrPermittedDangerousGoodsComponent } from '@forms/custom-sections/adr-permitted-dangerous-goods/adr-permitted-dangerous-goods.component';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

import { State, initialAppState } from '@store/index';

describe('AdrPermittedDangerousGoodsComponent', () => {
	let component: AdrPermittedDangerousGoodsComponent;
	let fixture: ComponentFixture<AdrPermittedDangerousGoodsComponent>;

	const control = new CustomFormControl({
		name: 'techRecord_adrDetails_permittedDangerousGoods',
		type: FormNodeTypes.CONTROL,
		value: [],
	});
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrPermittedDangerousGoodsComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: NgControl, useValue: { control } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrPermittedDangerousGoodsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	describe('getOptions', () => {
		it('should include explosives type 2 & 3 if adr body type is not tank or battery', () => {
			component.adrBodyType = ADRBodyType.ARTIC_TRACTOR;
			const multiOptions = [
				{ value: ADRDangerousGood.EXPLOSIVES_TYPE_2, label: ADRDangerousGood.EXPLOSIVES_TYPE_2 },
				{ value: ADRDangerousGood.EXPLOSIVES_TYPE_3, label: ADRDangerousGood.EXPLOSIVES_TYPE_3 },
			];
			expect(component.getOptions()).toContainEqual(multiOptions[0]);
			expect(component.getOptions()).toContainEqual(multiOptions[1]);
		});
		it('should not include explosives type 2 & 3 if adr body type is tank or battery', () => {
			component.adrBodyType = ADRBodyType.FULL_DRAWBAR_TANK;
			const multiOptions = [
				{ value: ADRDangerousGood.EXPLOSIVES_TYPE_2, label: ADRDangerousGood.EXPLOSIVES_TYPE_2 },
				{ value: ADRDangerousGood.EXPLOSIVES_TYPE_3, label: ADRDangerousGood.EXPLOSIVES_TYPE_3 },
			];
			expect(component.getOptions()).not.toContainEqual(multiOptions[0]);
			expect(component.getOptions()).not.toContainEqual(multiOptions[1]);
		});
	});
});
