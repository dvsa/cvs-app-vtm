import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

import { TechRecordTitleComponent } from './tech-record-title.component';

describe('TechRecordTitleComponent', () => {
  let component: TechRecordTitleComponent;
  let fixture: ComponentFixture<TechRecordTitleComponent>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordTitleComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, SharedModule, StoreModule.forRoot({})],
      providers: [
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
    fixture = TestBed.createComponent(TechRecordTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
