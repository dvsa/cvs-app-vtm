import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AdrCertsSectionEditComponent } from '../adr-certs-section-edit.component';

describe('AdrCertsSectionEditComponent', () => {
	let component: AdrCertsSectionEditComponent;
	let fixture: ComponentFixture<AdrCertsSectionEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrCertsSectionEditComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdrCertsSectionEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render the summary list container', () => {
		const summaryList = fixture.debugElement.query(By.css('dl.govuk-summary-list'));
		expect(summaryList).toBeTruthy();
	});

	it('should render a message informing the user this section is unavailable when amending or creating', () => {
		const key = fixture.debugElement.query(By.css('dt.govuk-summary-list__key'));
		expect(key.nativeElement.textContent.trim().replace(/\s+/g, ' ')).toBe(
			'This section is not available when amending or creating a technical record.'
		);
	});

	it('should not expose any inputs, outputs, or public methods', () => {
		const keys = Object.keys(component).filter((key) => key !== '__ngContext__');
		expect(keys).toEqual([]);
	});
});


