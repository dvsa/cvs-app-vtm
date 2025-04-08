import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';

import { TestRecordSummaryComponent } from '../test-record-summary.component';

describe('TestRecordSummaryComponent', () => {
	let component: TestRecordSummaryComponent;
	let fixture: ComponentFixture<TestRecordSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestRecordSummaryComponent],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestRecordSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not show table if no records found', () => {
		fixture.componentRef.setInput('testResults', []);
		fixture.detectChanges();

		const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
		expect(heading).toBeTruthy();
		expect(heading.nativeElement.innerHTML).toBe('No test records found.');

		const table = fixture.debugElement.query(By.css('.govuk-table__body'));
		expect(table).toBeFalsy();
	});

	it('should show table if records found', () => {
		fixture.componentRef.setInput('testResults', [createMockTestResult()]);
		fixture.detectChanges();

		const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
		expect(heading).toBeFalsy();

		const table = fixture.debugElement.query(By.css('.govuk-table__body'));
		expect(table).toBeTruthy();
	});

	it('should concatinate multiple test types', () => {
		const testTypeNames = component.getTestTypeName(
			createMockTestResult({
				testTypes: [createMockTestType({ testTypeName: 'name' }), createMockTestType({ testTypeName: 'name' })],
			})
		);
		expect(testTypeNames).toBe('name,name');
	});

	it('should concatinate multiple test results', () => {
		const testTypeResults = component.getTestTypeResults(
			createMockTestResult({
				testTypes: [
					createMockTestType({ testResult: resultOfTestEnum.pass }),
					createMockTestType({ testResult: resultOfTestEnum.pass }),
				],
			})
		);
		expect(testTypeResults).toBe('pass,pass');
	});

	it('should retrieve all testTypes and creates sorted TestField[]', () => {
		const mockRecords = [
			{
				testResultId: '1',
				testTypes: [
					{
						testTypeStartTimestamp: new Date('12/12/2022').toISOString(),
						testNumber: '1',
						testResult: resultOfTestEnum.pass,
						testTypeName: 'annual',
					},
					{
						testTypeStartTimestamp: new Date('12/12/2023').toISOString(),
						testNumber: '2',
						testResult: resultOfTestEnum.pass,
						testTypeName: 'annual',
					},
				],
			},
			{
				testResultId: '1',
				testTypes: [
					{
						testTypeStartTimestamp: new Date('12/12/2021').toISOString(),
						testNumber: '1',
						testResult: resultOfTestEnum.pass,
						testTypeName: 'annual',
					},
				],
			},
		] as TestResultModel[];
		fixture.componentRef.setInput('testResults', mockRecords);
		const testFieldResults = component.sortedTestTypeFields;

		expect(testFieldResults).toHaveLength(3);

		expect(testFieldResults[0].testTypeStartTimestamp).toBe(mockRecords[0].testTypes[1].testTypeStartTimestamp);
		expect(testFieldResults[1].testTypeStartTimestamp).toBe(mockRecords[0].testTypes[0].testTypeStartTimestamp);
		expect(testFieldResults[2].testTypeStartTimestamp).toBe(mockRecords[1].testTypes[0].testTypeStartTimestamp);
	});
});
