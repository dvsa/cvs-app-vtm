import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { ReplaySubject } from 'rxjs';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';
import { ConfirmCancellationComponent } from './confirm-cancellation.component';

describe('ConfirmCancellationComponent', () => {
  let component: ConfirmCancellationComponent;
  let fixture: ComponentFixture<ConfirmCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmCancellationComponent, VehicleHeaderComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, SharedModule],
      providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => new ReplaySubject<Action>())]
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
