import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TrimWhitespaceDirective } from './app-no-whitespace.directive';

@Component({
  template: ` <form [formGroup]="form"><input id="bar" appTrimWhitespace formControlName="foo" /></form>
    <input id="baz" appTrimWhitespace />`
})
class TestComponent {
  form = new FormGroup({
    foo: new FormControl()
  });
}

describe('TrimWhitespaceDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TrimWhitespaceDirective, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    input1 = fixture.debugElement.query(By.css('#bar')).nativeElement;
    input2 = fixture.debugElement.query(By.css('#baz')).nativeElement;
    component = fixture.componentInstance;
  });

  describe('should remove whitespaces on focusout', () => {
    it('with form', () => {
      input1.value = 'this has spaces';
      input1.dispatchEvent(new Event('focusout'));

      expect(input1.value).toBe('thishasspaces');
      expect(component.form.get('foo')?.value).toBe('thishasspaces');
    });

    it('without form', () => {
      input2.value = 'this has spaces';
      input2.dispatchEvent(new Event('focusout'));

      expect(input2.value).toBe('thishasspaces');
    });
  });
});
