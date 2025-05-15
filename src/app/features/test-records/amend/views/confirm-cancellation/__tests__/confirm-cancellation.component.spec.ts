import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';

import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { ConfirmCancellationComponent } from '../confirm-cancellation.component';

describe('ConfirmCancellationComponent', () => {
	let component: ConfirmCancellationComponent;
	let fixture: ComponentFixture<ConfirmCancellationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmCancellationComponent, VehicleHeaderComponent, ReactiveFormsModule],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => new ReplaySubject<Action>()),
				{
					provide: TestRecordsService,
					useValue: {
						cancelTest: () => {},
						isTestTypeGroupEditable$: of(false),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmCancellationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
