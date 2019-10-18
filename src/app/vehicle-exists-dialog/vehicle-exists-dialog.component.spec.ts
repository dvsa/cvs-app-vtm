import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleExistsDialogComponent } from './vehicle-exists-dialog.component';
import { MaterialModule } from "../material.module";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


describe('VehicleExistsDialogComponent', () => {
  let component: VehicleExistsDialogComponent;
  let fixture: ComponentFixture<VehicleExistsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleExistsDialogComponent ],
      imports: [ MatDialogModule, MaterialModule ],
      providers: [{provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleExistsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
