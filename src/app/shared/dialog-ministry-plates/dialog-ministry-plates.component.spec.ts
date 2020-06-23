import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';

import { Applicant } from '@app/models/tech-record.model';
import { DialogMinistryPlatesComponent } from './dialog-ministry-plates.component';

describe('DialogMinistryPlatesComponent', () => {
  let component: DialogMinistryPlatesComponent;
  let fixture: ComponentFixture<DialogMinistryPlatesComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MaterialModule, FormsModule, ReactiveFormsModule],
      declarations: [DialogMinistryPlatesComponent, TestMinistryPlatesTemplateComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMinistryPlatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should close the modal on cancel CTA', () => {
    spyOn(component.dialogRef, 'close');
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close the modal on save CTA & return newPlate object data', () => {
    const plateComponent = {
      platesForm: new FormGroup({ plateReasonForIssue: new FormControl('test') })
    };
    spyOn(component.dialogRef, 'close');
    component.save(plateComponent);
    expect(component.dialogRef.close).toHaveBeenCalledWith({ plateReasonForIssue: 'test' });
  });
});

@Component({
  selector: 'vtm-ministry-plates',
  exportAs: 'plateComponent',
  template: `
    <div>{{ applicantDetails | json }}</div>
  `
})
class TestMinistryPlatesTemplateComponent {
  @Input() applicantDetails: Applicant;
}
