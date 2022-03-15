import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userNameText: HTMLElement;
  let logOutButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.usernameObservable = new Observable<string>();
    fixture.detectChanges();

    userNameText = fixture.debugElement.nativeElement.querySelector('#username');
    logOutButton = fixture.debugElement.query(By.css('#sign-out'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Change username updates page', () => {
    component.usernameObservable = new Observable<string>(subscriber => { subscriber.next("Test"); subscriber.complete(); });

    component.ngOnInit();
    fixture.detectChanges();
    expect(userNameText.innerHTML).toBe("Test");
  }); 

  it('Clicking logout fires off event', (done) => {
    component.logOutEvent.subscribe(() => {
      done();
    });

    logOutButton.triggerEventHandler('click', null);
  }); 
});
