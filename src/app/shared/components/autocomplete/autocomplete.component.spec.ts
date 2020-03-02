import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: TestAutocompleteComponent;
  let fixture: ComponentFixture<TestAutocompleteComponent>;
  let autocompleteInput: FormControl;
  let form: NgForm;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TestAutocompleteComponent, AutocompleteComponent],
      providers: [NgForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.testAutocompleteControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-autocomplete',
  template: `
    <form>
      <vtm-date-input
        id="testAutocomplete"
        name="testAutocomplete"
        [formControl]="testAutocompleteControl"
        aria-describedby="identifier"
        ngDefaultControl
      ></vtm-date-input>
    </form>
  `
})
class TestAutocompleteComponent {
  testAutocompleteControl: FormControl;
}
