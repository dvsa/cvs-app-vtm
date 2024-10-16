import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { AdrService } from '@services/adr/adr.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { AdrComponent } from '../adr.component';

describe('AdrComponent', () => {
	let component: AdrComponent;
	let fixture: ComponentFixture<AdrComponent>;

	const hgv = createMockHgv(1234);

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdrComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: TechnicalRecordService, useValue: { updateEditingTechRecord: jest.fn() } },
				{
					provide: AdrService,
					useValue: { preprocessTechRecord: jest.fn().mockReturnValue(hgv), determineTankStatementSelect: jest.fn() },
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrComponent);
		component = fixture.componentInstance;
		component.techRecord = hgv;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should preprocess the tech record', () => {
			const spy = jest.spyOn(component.adrService, 'preprocessTechRecord');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('handleFormChange', () => {
		it('the form should be updated', () => {
			const testData = { test: 11 };
			const spy = jest.spyOn(component.form, 'patchValue');
			component.handleFormChange(testData);
			expect(spy).toHaveBeenCalled();
		});

		it('should not update the form if the event is null', () => {
			const testData = null as unknown as Record<string, unknown>;
			const spy = jest.spyOn(component.form, 'patchValue');
			component.handleFormChange(testData);
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not update the form if the techRecord is null', () => {
			component.techRecord = null as unknown as TechRecordType<'hgv' | 'lgv' | 'trl'>;
			const testData = { test: 11 };
			const spy = jest.spyOn(component.form, 'patchValue');
			component.handleFormChange(testData);
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('adr documentation methods', () => {
		it('should return false if I do not have a document id', () => {
			component.techRecord = {} as unknown as TechRecordType<'hgv' | 'lgv' | 'trl'>;
			const res = component.hasAdrDocumentation();
			expect(res).toBeFalsy();
		});

		it('should return true if I do have a document id', () => {
			component.techRecord = { techRecord_adrDetails_documentId: '1234' } as unknown as TechRecordType<
				'hgv' | 'lgv' | 'trl'
			>;
			const res = component.hasAdrDocumentation();
			expect(res).toBeTruthy();
		});

		it('should return a map with filename in', () => {
			const map = new Map([['adrDocumentId', 'filename']]);
			component.techRecord.techRecord_adrDetails_documentId = 'filename';
			expect(component.documentParams).toStrictEqual(map);
		});

		it('should return the filename', () => {
			component.techRecord.techRecord_adrDetails_documentId = 'filename';
			expect(component.fileName).toBe('filename');
		});

		it('should error if no filename', () => {
			component.techRecord.techRecord_adrDetails_documentId = undefined;
			// eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
			expect(() => {
				component.fileName;
			}).toThrow('Could not find ADR Documentation');
		});
	});
});
