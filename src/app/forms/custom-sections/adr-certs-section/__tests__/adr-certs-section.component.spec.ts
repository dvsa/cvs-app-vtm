import { UserService } from '@/src/app/services/user-service/user-service';
import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Modes } from '@models/modes.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { AdrCertsSectionEditComponent } from '../adr-certs-section-edit/adr-certs-section-edit.component';
import { AdrCertsSectionViewComponent } from '../adr-certs-section-view/adr-certs-section-view.component';
import { AdrCertsSectionComponent } from '../adr-certs-section.component';

describe('AdrCertsSectionComponent', () => {
	let component: AdrCertsSectionComponent;
	let fixture: ComponentFixture<AdrCertsSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrCertsSectionComponent],
			providers: [
				ControlContainer,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { roles$: of(['TechRecord.View']) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrCertsSectionComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(0) as V3TechRecordModel);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render the view component in view mode', () => {
		fixture.componentRef.setInput('mode', Modes.VIEW);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionViewComponent))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionEditComponent))).toBeFalsy();
	});

	it('should render the edit component in edit mode', () => {
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionEditComponent))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionViewComponent))).toBeFalsy();
	});

	it('should render nothing for an unhandled mode', () => {
		fixture.componentRef.setInput('mode', Modes.SUMMARY);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionViewComponent))).toBeFalsy();
		expect(fixture.debugElement.query(By.directive(AdrCertsSectionEditComponent))).toBeFalsy();
	});
});
