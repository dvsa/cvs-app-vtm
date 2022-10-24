import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';

import { TechAmendReasonComponent } from './tech-amend-reason.component';
import { StoreModule } from '@ngrx/store';

describe('TechAmendReasonComponent', () => {
  let component: TechAmendReasonComponent;
  let fixture: ComponentFixture<TechAmendReasonComponent>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechAmendReasonComponent ],
      imports: [RouterTestingModule, DynamicFormsModule, ReactiveFormsModule, StoreModule.forRoot({}),]
    })
    .compileComponents();

    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechAmendReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
