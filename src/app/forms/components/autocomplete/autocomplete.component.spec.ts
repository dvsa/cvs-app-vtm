import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

jest.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => {
  return {
    __esModule: true,
    default: jest.fn(),
    enhanceSelectElement: () => { }
  }
});

@Component({
  selector: 'app-host-component',
  template: '<form [formGroup]="form"><app-autocomplete [name]="name" [options]="options" formControlName="foo"></app-autocomplete></form>'
})
class HostComponent {
  name = 'autocomplete';
  options = ['option1', 'option2', 'option3'];
  form = new FormGroup({ foo: new FormControl() })
}


describe('AutocompleteComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let mockDocument = jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
    return ({ insertBefore: () => { }, setAttribute: (qualifedName: string, value: string) => { }, appendChild: (node: any) => node } as unknown) as Element;
  });


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent, HostComponent],
      imports: [FormsModule, ReactiveFormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
