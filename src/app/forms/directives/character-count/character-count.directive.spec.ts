import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ValidatorNames } from '@forms/models/validators.enum';
import { CharacterCountDirective } from './character-count.directive';

@Component({
  selector: 'app-test',
  template: ` <div>
    <div>
      <textarea [appCharacterCount] [metaData]="meta" id="test-text-area"></textarea>
    </div>
  </div>`
})
class TestComponent {
  @ViewChild(CharacterCountDirective) directive!: CharacterCountDirective;
  meta? = { validators: [{ name: ValidatorNames.MaxLength, args: 5 }] };
}

describe('CharacterCountDirective', () => {
  let host: TestComponent;
  let hostElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;
  let textArea: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterCountDirective, TestComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostElement = fixture.debugElement;
    host = fixture.componentInstance;
    textArea = hostElement.query(By.directive(CharacterCountDirective)).nativeElement;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(host.directive).toBeTruthy();
  });

  it('should not render a character count element', () => {
    host.meta = undefined;
    fixture.detectChanges();

    const ccEl = fixture.debugElement.query(By.css('#test-text-area-character-count'));
    expect(ccEl).toBeFalsy();
  });

  it('should render a character count div with the correct initial value', () => {
    fixture.detectChanges();
    const ccEl = fixture.debugElement.query(By.css('#test-text-area-character-count'));
    expect(ccEl).toBeTruthy();
    expect(ccEl.nativeElement.innerHTML).toBe('You can enter up to 5 characters');
  });

  it('should update character count message on input', () => {
    fixture.detectChanges();
    const $event = new Event('input');
    textArea.value = 'a';
    textArea.dispatchEvent($event);
    const ccEl = hostElement.query(By.css('#test-text-area-character-count'));
    expect(ccEl.nativeElement.innerHTML).toBe('You have 4 characters remaining');
  });

  it('character count message should not go below 0', () => {
    fixture.detectChanges();
    const $event = new Event('input');
    textArea.value = 'abcdef';
    textArea.dispatchEvent($event);
    const ccEl = hostElement.query(By.css('#test-text-area-character-count'));
    expect(ccEl.nativeElement.innerHTML).toBe('You have 0 characters remaining');
  });

  it('character count message should go back to default', () => {
    fixture.detectChanges();
    const $event = new Event('input');
    textArea.value = '';
    textArea.dispatchEvent($event);
    const ccEl = hostElement.query(By.css('#test-text-area-character-count'));
    expect(ccEl.nativeElement.innerHTML).toBe('You can enter up to 5 characters');
  });
});
