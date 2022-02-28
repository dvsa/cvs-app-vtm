import { scrollToSection } from './utils.functions';

describe('Scroll down to & open section utility function', () => {
  const mockPanels = [
    { panel: 'Test History', isOpened: true },
    { panel: 'Tech Record History', isOpened: true }
  ];
  window.scrollTo = jest.fn();
  it('should scroll down & open the section', () => {
    const scrollOptions = { top: document.body.scrollHeight };
    spyOn(window, 'scrollTo');
    window.scrollTo(scrollOptions);
    const indexOfSection = 1;
    mockPanels[indexOfSection].isOpened = true;

    expect(window.scrollTo).toHaveBeenCalledWith(scrollOptions);
    expect(mockPanels[indexOfSection].isOpened).toBe(true);
  });
});
