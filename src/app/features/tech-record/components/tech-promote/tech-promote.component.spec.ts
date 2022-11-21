import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

import { TechPromoteComponent } from './tech-promote.component';

describe('TechPromoteComponent', () => {
  let actions$: ReplaySubject<Action>;
  let component: TechPromoteComponent;
  let fixture: ComponentFixture<TechPromoteComponent>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>();

    await TestBed.configureTestingModule({
      declarations: [TechPromoteComponent, TechRecordTitleComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, SharedModule, StoreModule.forRoot({})],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: UserService,
          useValue: {
            roles$: of([Roles.TechRecordArchive])
          }
        }
      ]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechPromoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
