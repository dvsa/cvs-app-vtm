import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {VehicleNotFoundDialogComponent} from './vehicle-not-found-dialog.component';

describe('VehicleNotFoundDialogComponent', () => {
  let component: VehicleNotFoundDialogComponent;
  let fixture: ComponentFixture<VehicleNotFoundDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleNotFoundDialogComponent],
      imports: [MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {close: jest.fn()}}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNotFoundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', inject([MatDialogRef], () => {
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
