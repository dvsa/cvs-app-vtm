import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { GlobalErrorComponent } from './global-error.component';
import { GlobalErrorService } from './global-error.service';

@Component({
  selector: 'app-mock-component',
  template: `<app-global-error></app-global-error><input id="test-input" type="text" />
`,
  styles: []
})
class MockComponent {}

describe('GlobalErrorComponent', () => {
  let hostComponent: MockComponent;
  let component: GlobalErrorComponent;
  let fixture: ComponentFixture<MockComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalErrorComponent, MockComponent],
      imports: [RouterTestingModule],
      providers: [GlobalErrorService, provideMockStore({ initialState: initialGlobalErrorState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(GlobalErrorComponent)).componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goto', () => {
    it('should navigate to fragment', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const input: HTMLInputElement = fixture.debugElement.query(By.css('#test-input')).nativeElement;
      component.goto({ message: 'navigate', anchorLink: 'test-input' });

      expect(navigateSpy).toHaveBeenCalledWith([], { fragment: 'test-input' });
      console.log(document.activeElement?.outerHTML);
      expect(document.activeElement).toBe(input);
    });
    it('should not navigate to fragment', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const input: HTMLInputElement = fixture.debugElement.query(By.css('#test-input')).nativeElement;
      component.goto({ message: `don't navigate`, anchorLink: '' });

      expect(navigateSpy).not.toHaveBeenCalled();
      console.log(document.activeElement?.outerHTML);
      expect(document.activeElement).not.toBe(input);
    });
  });
});
