import { DigitOnlyDirective } from './digit-only.directive';

describe('DigitOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new DigitOnlyDirective();
    expect(directive).toBeTruthy();
  });
  it('should call prevent default on non numeric key press', () => {
    const directive = new DigitOnlyDirective();
    const event: KeyboardEvent = {
      key: 'a',
      preventDefault: () => {}
    } as KeyboardEvent;
    spyOn(event, 'preventDefault');
    directive.onKeyDown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
