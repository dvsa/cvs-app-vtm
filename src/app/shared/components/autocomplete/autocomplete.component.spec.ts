import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from './autocomplete.component';
import { By } from '@angular/platform-browser';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  let testComponent: TestAutocompleteComponent;
  let testFixture: ComponentFixture<TestAutocompleteComponent>;
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

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component._value = 'test input';
    component.autocompleteData = ['test data'];
    component.autocompleteInput = new FormControl();

    testFixture = TestBed.createComponent(TestAutocompleteComponent);
    testComponent = testFixture.componentInstance;

    testFixture.componentInstance.testAutocompleteControl = new FormControl('');
    testFixture.detectChanges();
    tick();

    form = testFixture.debugElement.children[0].injector.get(NgForm);
    inputControl = form.control.get('testAutocomplete') as FormControl;
    inputElement = testFixture.debugElement.query(By.css('[name=testAutocomplete]'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should populate the internal input when an external value is provided', fakeAsync(() => {
    testFixture.componentInstance.testAutocompleteControl = new FormControl('testing');
    testFixture.detectChanges();
    tick();

    expect(testFixture).toMatchSnapshot();
  }));

  it('should correctly write value into input field', () => {
    component.writeValue('test write');
    expect(component.autocompleteInput.value).toBe('test write');
  });

  it('should change value on registerOnChange', () => {
    component.registerOnChange('');
    expect(component.autocompleteInput.value).toBe(null);
  });

  it('should change value on registerOnTouched', () => {
    component.registerOnTouched('');
    expect(component.autocompleteInput.value).toBe(null);
  });

});

@Component({
  selector: 'test-autocomplete',
  template: `
    <form>
      <vtm-autocomplete
        [autocompleteData]="['']"
        id="testAutocomplete"
        name="testAutocomplete"
        ariaDescribedBy="testAutocomplete"
        [formControl]="testAutocompleteControl"
        ngDefaultControl
      ></vtm-autocomplete>
    </form>
  `
})
class TestAutocompleteComponent {
  testAutocompleteControl: FormControl;
}
