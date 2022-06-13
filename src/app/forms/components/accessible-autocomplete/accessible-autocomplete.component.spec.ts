import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessibleAutocompleteComponent } from './accessible-autocomplete.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-host-component',
  template: '<form [formGroup]="form"><app-accessible-autocomplete [name]="name" [options]="options" formControlName="foo"></app-accessible-autocomplete></form>'
})
class HostComponent {
  name = 'accessible-autocomplete';
  options = ['option1', 'option2', 'option3'];
  form = new FormGroup({foo: new FormControl()})
}


describe('AccessibleAutocompleteComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let mockDocument = jest.spyOn(document, 'querySelector');


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibleAutocompleteComponent, HostComponent ],
      providers:[{provide: Document, useValue: mockDocument}],
      imports: [FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    let mockElement = document.createElement('div');
    mockElement.setAttribute('id', "accessible-autocomplete");
    mockDocument.mockReturnValue(mockElement);
    //should ideally not be mocking document but use the dom that is created by jest instead?
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();  
  });
});
