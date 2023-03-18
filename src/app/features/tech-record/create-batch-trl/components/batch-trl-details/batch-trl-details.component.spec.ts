import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';

import { BatchTrlDetailsComponent } from './batch-trl-details.component';

describe('BatchTrlDetailsComponent', () => {
  let component: BatchTrlDetailsComponent;
  let fixture: ComponentFixture<BatchTrlDetailsComponent>;
  let router: Router;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchTrlDetailsComponent],
      imports: [DynamicFormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [FormBuilder, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BatchTrlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
