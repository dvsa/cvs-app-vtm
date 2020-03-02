import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from './autocomplete.component';
import {By} from '@angular/platform-browser';

describe('AutocompleteComponent', () => {
  let component: TestAutocompleteComponent;
  let fixture: ComponentFixture<TestAutocompleteComponent>;
  let form: NgForm;
  let inputControl: FormControl;
  let inputElement: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TestAutocompleteComponent, AutocompleteComponent],
      providers: [NgForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(TestAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.testAutocompleteControl = new FormControl('');
    fixture.detectChanges();
    tick();

    form = fixture.debugElement.children[0].injector.get(NgForm);
    inputControl = form.control.get('testAutocomplete') as FormControl;
    inputElement = fixture.debugElement.query(By.css('[name=testAutocomplete]'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('populates the internal input when an external value is provided', fakeAsync(() => {
    fixture.componentInstance.testAutocompleteControl = new FormControl('testing');
    fixture.detectChanges();
    tick();

    expect(inputElement.nativeElement.value).toEqual('testing');
  }));

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
