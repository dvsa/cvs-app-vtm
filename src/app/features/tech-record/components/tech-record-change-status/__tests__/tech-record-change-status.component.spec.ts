import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { TechRecordTitleComponent } from '../../tech-record-title/tech-record-title.component';
import { TechRecordChangeStatusComponent } from '../tech-record-change-status.component';

describe('TechRecordChangeStatusComponent', () => {
	let actions$: ReplaySubject<Action>;
	let component: TechRecordChangeStatusComponent;
	let fixture: ComponentFixture<TechRecordChangeStatusComponent>;

	beforeEach(async () => {
		actions$ = new ReplaySubject<Action>();

		await TestBed.configureTestingModule({
			imports: [TechRecordChangeStatusComponent, TechRecordTitleComponent, ReactiveFormsModule],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: APP_BASE_HREF, useValue: '/' },
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordArchive]),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordChangeStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
