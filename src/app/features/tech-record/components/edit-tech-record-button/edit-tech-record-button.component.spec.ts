import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';

describe('EditTechRecordButtonComponent', () => {
  let component: EditTechRecordButtonComponent;
  let fixture: ComponentFixture<EditTechRecordButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTechRecordButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
