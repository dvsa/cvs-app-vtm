import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

import { TechRecordChangeVisibilityComponent } from './tech-record-change-visibility.component';

describe('TechRecordHoldComponent', () => {
	let actions$: ReplaySubject<Action>;
	let component: TechRecordChangeVisibilityComponent;
	let fixture: ComponentFixture<TechRecordChangeVisibilityComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TechRecordChangeVisibilityComponent, TechRecordTitleComponent],
			imports: [
				DynamicFormsModule,
				HttpClientTestingModule,
				ReactiveFormsModule,
				RouterTestingModule,
				SharedModule,
				StoreModule.forRoot({}),
			],
			providers: [
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
		fixture = TestBed.createComponent(TechRecordChangeVisibilityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
