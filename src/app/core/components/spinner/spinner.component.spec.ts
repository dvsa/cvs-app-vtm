import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';
import { Observable, of, Subject, BehaviorSubject} from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';

class MockSpinnerService {

  showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get showSpinner$(): Observable<boolean> {
    return this.showSpinner;
  }

  public setSpinner(value: boolean) {
    this.showSpinner.next(value);
  }
}

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinner: HTMLElement;
  let spinnerService: MockSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      providers: [{provide: SpinnerService, useClass: MockSpinnerService }]
    }).compileComponents();

    spinnerService = TestBed.get(SpinnerService);
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Default should not show
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeNull();
  });

  it('should show', () => {
    spinnerService.setSpinner(true);
    fixture.detectChanges();
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  it('should NOT show', () => {
    spinnerService.setSpinner(false);
    fixture.detectChanges();
    spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
    expect(spinner).toBeNull();
  });
});
