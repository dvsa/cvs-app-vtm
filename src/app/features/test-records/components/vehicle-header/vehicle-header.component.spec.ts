import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestTypesService } from '@api/test-types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { VehicleHeaderComponent } from './vehicle-header.component';

describe('VehicleHeaderComponent', () => {
  let component: VehicleHeaderComponent;
  let fixture: ComponentFixture<VehicleHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleHeaderComponent],
      imports: [SharedModule, HttpClientTestingModule],
      providers: [TestTypesService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
