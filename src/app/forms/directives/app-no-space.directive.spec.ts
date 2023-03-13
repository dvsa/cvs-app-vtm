import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoSpaceDirective } from './app-no-space.directive';

@Component({
  template: ` <input appNoSpace />`
})
class TestComponent {}

describe('NoSpaceDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [NoSpaceDirective, TestComponent]
    }).createComponent(TestComponent);
    fixture.detectChanges();

    input = fixture.debugElement.query(By.directive(NoSpaceDirective)).nativeElement;
  });
  it('should create an instance', () => {
    expect(input).toBeTruthy();
  });

  it('should prevent default event behaviour if a prohibited key is pressed', () => {
    const $event = new KeyboardEvent('keydown', { key: 'Space', cancelable: true });
    expect(input.dispatchEvent($event)).toBe(false);
    expect($event.defaultPrevented).toBe(true);
  });

  it('should not prevent default event behaviour if a prohibited key is pressed', () => {
    const $event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    expect(input.dispatchEvent($event)).toBe(true);
    expect($event.defaultPrevented).toBe(false);
  });
});
