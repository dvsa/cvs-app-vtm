import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { DynamicFormGroupComponent } from '../dynamic-form-group.component';

describe('DynamicFormGroupComponent', () => {
	let component: DynamicFormGroupComponent;
	let fixture: ComponentFixture<DynamicFormGroupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				TestStationsService,
				{ provide: UserService, useValue: {} },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicFormGroupComponent);
		component = fixture.componentInstance;
		// Don't detect changes on the first load as it will prevent change detection
		// from working in the test function due to change detection being OnPush
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('DynamicFormGroupComponent.prototype.trackByFn.name', () => {
		it.each([
			[3, [3, 'some value']],
			['foo', [3, { key: 'foo' }]],
		])('should return %s when given %o', (expected, props) => {
			const [index, item] = props;
			expect(component.trackByFn(index as number, item)).toBe(expected);
		});
	});

	it.each([
		[
			{ a: 'b', c: 1 },
			[
				{ key: 'a', value: 'b' },
				{ key: 'c', value: 1 },
			],
		],
		[
			{
				name: 'test-name',
				label: 'test-label',
				type: 'test-type',
				children: [
					{
						name: 'test-c-name',
						label: 'test-c-label',
						value: 'test-c-value',
						children: [],
						type: 'test-c-control',
						viewType: 'test-c-viewType',
					},
				],
			},
			[
				{ key: 'name', value: 'test-name' },
				{ key: 'label', value: 'test-label' },
				{ key: 'type', value: 'test-type' },
				{
					key: 'children',
					value: [
						{
							name: 'test-c-name',
							label: 'test-c-label',
							value: 'test-c-value',
							children: [],
							type: 'test-c-control',
							viewType: 'test-c-viewType',
						},
					],
				},
			],
		],
	])('entriesOf: should split the keys out into values', (input, expected) => {
		expect(component.entriesOf(input as unknown as FormGroup<object>)).toStrictEqual(expected);
	});

	describe('formNodeTypes', () => {
		it('should return FormNodeTypes enum', () => {
			Object.entries(FormNodeTypes).forEach((entry) => {
				expect(FormNodeTypes).toEqual(component.formNodeTypes);
				expect(component.formNodeTypes[entry[0] as keyof typeof FormNodeTypes]).toBe(entry[1]);
			});
		});
	});

	describe('formNodeViewTypes', () => {
		it('should return FormNodeViewTypes enum', () => {
			Object.entries(FormNodeViewTypes).forEach((entry) => {
				expect(FormNodeViewTypes).toEqual(component.formNodeViewTypes);
				expect(component.formNodeViewTypes[entry[0] as keyof typeof FormNodeViewTypes]).toBe(entry[1]);
			});
		});
	});

	describe('template', () => {
		const template = <FormNode>{
			name: 'myForm',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'levelOneControl',
					type: FormNodeTypes.CONTROL,
					label: 'Level one control',
					value: 'some string',
				},
				{
					name: 'levelOneGroup',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'levelTwoControl',
							type: FormNodeTypes.CONTROL,
							label: 'Level two control',
							value: 'some string',
						},
						{
							name: 'levelTwoArray',
							type: FormNodeTypes.ARRAY,
							children: [
								{ name: 'levelTwoArrayControlOne', type: FormNodeTypes.CONTROL, value: '1' },
								{ name: 'levelTwoArrayControlTwo', type: FormNodeTypes.CONTROL, value: '2' },
							],
						},
					],
				},
			],
		};

		const data = {
			levelOneControl: 'some string',
			levelOneGroup: {
				levelTwoControl: 'some string',
				levelTwoArray: [
					{
						levelTwoArrayControlOne: 'some string',
						levelTwoArrayControlTwo: 'some string',
					},
				],
			},
		};

		it('should generate the correct number of detail summary elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const trList = fixture.debugElement.queryAll(By.css('tr'));
				const tdList = fixture.debugElement.queryAll(By.css('td'));

				expect(trList).toHaveLength(4);
				expect(tdList).toHaveLength(8);
			}
		));

		it('should generate the correct number of input elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(4);
			}
		));
	});

	describe('template for nested array with groups', () => {
		const template = <FormNode>{
			name: 'myForm',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'levelOneControl',
					type: FormNodeTypes.CONTROL,
					label: 'Level one control',
					value: 'some string',
				},
				{
					name: 'levelOneGroup',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'levelTwoControl',
							type: FormNodeTypes.CONTROL,
							label: 'Level two control',
							value: 'some string',
						},
						{
							name: 'levelTwoArray',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: 'levelThreeArray',
									type: FormNodeTypes.ARRAY,
									children: [
										{
											name: 'levelThreeGroup',
											type: FormNodeTypes.GROUP,
											children: [
												{ name: 'levelThreeArrayControlOne', type: FormNodeTypes.CONTROL, value: '1' },
												{ name: 'levelThreeArrayControlTwo', type: FormNodeTypes.CONTROL, value: '2' },
											],
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const data = {
			levelOneControl: 'some string',
			levelOneGroup: {
				levelTwoControl: 'some string',
				levelTwoArray: [
					[
						{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
						{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
					],
					[
						{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
						{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
					],
				],
			},
		};

		it('should generate the correct number of detail summary elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const trList = fixture.debugElement.queryAll(By.css('tr'));
				const tdList = fixture.debugElement.queryAll(By.css('td'));

				expect(trList).toHaveLength(10);
				expect(tdList).toHaveLength(20);
			}
		));

		it('should generate the correct number of input elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(10);
			}
		));

		it('should generate the correct number of input elements if I reduce the data', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				const newData = {
					levelOneControl: 'some string',
					levelOneGroup: {
						levelTwoControl: 'some string',
						levelTwoArray: [
							[{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' }],
							[{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' }],
						],
					},
				};
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, newData);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(6);
			}
		));

		it('should generate the correct number of input elements if I increase the data', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				const newData = {
					levelOneControl: 'some string',
					levelOneGroup: {
						levelTwoControl: 'some string',
						levelTwoArray: [
							[
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
							],
							[
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
								{ levelThreeArrayControlOne: 'some string', levelThreeArrayControlTwo: 'some string' },
							],
						],
					},
				};
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, newData);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(14);
			}
		));
	});

	describe('template for array with groups', () => {
		const template = <FormNode>{
			name: 'myForm',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'levelOneControl',
					type: FormNodeTypes.CONTROL,
					label: 'Level one control',
					value: 'some string',
				},
				{
					name: 'levelOneGroup',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'levelTwoControl',
							type: FormNodeTypes.CONTROL,
							label: 'Level two control',
							value: 'some string',
						},
						{
							name: 'levelTwoArray',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: 'levelTwoGroup',
									type: FormNodeTypes.GROUP,
									children: [
										{ name: 'levelTwoArrayControlOne', type: FormNodeTypes.CONTROL, value: '1' },
										{ name: 'levelTwoArrayControlTwo', type: FormNodeTypes.CONTROL, value: '2' },
									],
								},
							],
						},
					],
				},
			],
		};

		const data = {
			levelOneControl: 'some string',
			levelOneGroup: {
				levelTwoControl: 'some string',
				levelTwoArray: [
					{
						levelTwoArrayControlOne: 'some string',
						levelTwoArrayControlTwo: 'some string',
					},
					{
						levelTwoArrayControlOne: 'some string',
						levelTwoArrayControlTwo: 'some string',
					},
				],
			},
		};

		it('should generate the correct number of detail summary elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const trList = fixture.debugElement.queryAll(By.css('tr'));
				const tdList = fixture.debugElement.queryAll(By.css('td'));

				expect(trList).toHaveLength(6);
				expect(tdList).toHaveLength(12);
			}
		));

		it('should generate the correct number of input elements', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(6);
			}
		));

		it('should generate the correct number of input elements if I reduce the data', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				const newData = {
					levelOneControl: 'some string',
					levelOneGroup: {
						levelTwoControl: 'some string',
						levelTwoArray: [
							{
								levelTwoArrayControlOne: 'some string',
								levelTwoArrayControlTwo: 'some string',
							},
						],
					},
				};
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, newData);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(4);
			}
		));

		it('should generate the correct number of input elements if I increase the data', inject(
			[DynamicFormService],
			(dfs: DynamicFormService) => {
				const newData = {
					levelOneControl: 'some string',
					levelOneGroup: {
						levelTwoControl: 'some string',
						levelTwoArray: [
							{
								levelTwoArrayControlOne: 'some string',
								levelTwoArrayControlTwo: 'some string',
							},
							{
								levelTwoArrayControlOne: 'some string',
								levelTwoArrayControlTwo: 'some string',
							},
							{
								levelTwoArrayControlOne: 'some string',
								levelTwoArrayControlTwo: 'some string',
							},
						],
					},
				};
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, newData);

				fixture.detectChanges();

				const inputList = fixture.debugElement.queryAll(By.css('input'));

				expect(inputList).toHaveLength(8);
			}
		));
	});

	describe('value changes', () => {
		const template = <FormNode>{
			name: 'myForm',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'levelOneControl',
					type: FormNodeTypes.CONTROL,
					label: 'Level one control',
					value: 'some string',
				},
			],
		};

		const data = {
			levelOneControl: 'some string',
		};
		it('should output an event when the value of the control changes', fakeAsync(
			inject([DynamicFormService], (dfs: DynamicFormService) => {
				fixture.componentRef.setInput('edit', true);
				component.form = dfs.createForm(template, data);

				fixture.detectChanges();

				const control = component.form.get('levelOneControl');
				control?.patchValue('foo');
				const emitter = jest.spyOn(component.formChange, 'emit');
				tick(500);
				expect(emitter).toHaveBeenCalledWith({ ...data, levelOneControl: 'foo' });
				expect(emitter).toHaveBeenCalledTimes(1);
			})
		));
	});
});
