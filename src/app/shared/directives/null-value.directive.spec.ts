import { TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgControl } from '@angular/forms';

import { NullValueDirective } from './null-value.directive';

describe('NullValueDirective', () => {
  let directive: NullValueDirective;
  let baseControl: NgControl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: NgControl,
          useValue: {
            control: {
              patchValue: jest.fn()
            }
          }
        }
      ]
    }).compileComponents();

    baseControl = TestBed.get(NgControl);
    directive = new NullValueDirective(baseControl);
  }));

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it(`should update the the control value to null when the 'interacted' value is empty string `, () => {
    const element: HTMLInputElement = document.createElement('input');
    element.value = '';

    jest.spyOn(baseControl.control, 'patchValue');
    directive.onEvent(element);

    expect(baseControl.control.patchValue).toHaveBeenCalledWith(null);
  });
});
