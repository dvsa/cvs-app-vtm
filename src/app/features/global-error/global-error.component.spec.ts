import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { GlobalErrorComponent } from './global-error.component';
import { GlobalErrorService } from './global-error.service';

@Component({
  selector: 'app-mock-component',
  template: '<app-global-error></app-global-error><input id="test-input" type="text" />',
  styles: []
})
class MockComponent {}

describe('GlobalErrorComponent', () => {
  let hostComponent: MockComponent;
  let component: GlobalErrorComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalErrorComponent, MockComponent],
      imports: [],
      providers: [GlobalErrorService, provideMockStore({ initialState: initialGlobalErrorState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(GlobalErrorComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goto', () => {
    it('should focus element', () => {
      const input: HTMLInputElement = fixture.debugElement.query(By.css('#test-input')).nativeElement;
      component.goto({ error: 'navigate', anchorLink: 'test-input' });

      expect(document.activeElement).toBe(input);
    });
  });
});
