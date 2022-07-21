import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { UserRoleDirective } from './user-role.directive';

@Component({
  template: `
    <div id="displayBox" *appUserRole="['CVSFullAccess']">
      <h1>This can display</h1>
    </div>
    <div id="hiddenBox" *appUserRole="['No Access']">
      <h1>This cannot display</h1>
    </div>
    <div id="errorBox" *appUserRole="">
      <h1>This is an error case</h1>
    </div>
  `
})
class TestComponent {}

describe('UserDirectiveDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [UserRoleDirective, TestComponent],
      providers: [provideMockStore({ initialState: initialAppState }), { provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } }]
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding
  });

  it('should display the element', () => {
    const seenBox = fixture.debugElement.queryAll(By.css('#displayBox'));
    expect(seenBox.length).toEqual(1);
  });

  it('should hide the element', () => {
    const hiddenBox = fixture.debugElement.queryAll(By.css('#hiddenBox'));
    expect(hiddenBox.length).toEqual(0);
  });

  it('should hide the element when nothing is provided', () => {
    const errorBox = fixture.debugElement.queryAll(By.css('#errorBox'));
    expect(errorBox.length).toEqual(0);
  });
});
