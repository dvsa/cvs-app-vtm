import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Defect } from '@models/defect';
import { of } from 'rxjs';
import { createMockList } from 'ts-auto-mock';
import { DefectsComponent } from './defects.component';

@Component({
  selector: 'app-defect',
  template: ``,
  styles: []
})
class MockDefectComponent {
  @Input() isEditing = false;
  @Input() defect!: Defect;
}

describe('DefectsComponent', () => {
  let component: DefectsComponent;
  let fixture: ComponentFixture<DefectsComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefectsComponent, MockDefectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct header', () => {
    expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Defects');
  });

  describe('No defects', () => {
    it('should be dysplayed when defects is undefined or empty array', fakeAsync(() => {
      const expectedText = 'No defects';
      component.defects = undefined;

      tick();
      fixture.detectChanges();

      let text: HTMLParagraphElement = el.query(By.css('p')).nativeElement;
      expect(text.innerHTML).toBe(expectedText);

      component.defects = undefined;

      tick();
      fixture.detectChanges();

      text = el.query(By.css('p')).nativeElement;
      expect(text.innerHTML).toBe(expectedText);
    }));
  });

  describe('Defects', () => {
    it('should render app-defect component', fakeAsync(() => {
      component.defects = createMockList<Defect>(1);

      tick();
      fixture.detectChanges();

      expect(el.query(By.directive(MockDefectComponent))).toBeTruthy();
      expect(el.query(By.directive(MockDefectComponent))).toBeDefined();
    }));
  });
});
