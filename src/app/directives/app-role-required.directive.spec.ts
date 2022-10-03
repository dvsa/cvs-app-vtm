import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { RoleRequiredDirective } from './app-role-required.directive';

@Component({
  template: `
    <div id="displayBox" *appRoleRequired="Roles.TechRecordView">
      <h1>This can display</h1>
    </div>
    <div id="hiddenBox" *appRoleRequired="Roles.TechRecordCreate">
      <h1>This cannot display</h1>
    </div>
    <div id="errorBox" *appRoleRequired="ThisIsNotFromTheRolesEnum">
      <h1>This is an error case</h1>
    </div>
  `
})
class TestComponent {
  public get Roles() {
    return Roles;
  }
}

describe('RoleRequiredDirective', () => {
  let userRoles: string[] = ['TechRecord.View'];
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      declarations: [RoleRequiredDirective, TestComponent],
      providers: [provideMockStore({ initialState: initialAppState }), { provide: UserService, useValue: { roles$: of(userRoles) } }]
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

  it('should hide the element if the role needed is invalid (i.e. not from the Roles enum)', () => {
    const errorBox = fixture.debugElement.queryAll(By.css('#errorBox'));
    expect(errorBox.length).toEqual(0);
  });
});

describe('RoleRequiredDirective without roles', () => {
  it('should hide the element when no roles are available', () => {
    const  fixture: ComponentFixture<TestComponent> = TestBed
      .configureTestingModule({
        declarations: [RoleRequiredDirective, TestComponent],
        providers: [provideMockStore({ initialState: initialAppState }), { provide: UserService, useValue: { roles$: of(null) } }]
      })
      .createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    const seenBox = fixture.debugElement.queryAll(By.css('#errorBox'));
    expect(seenBox.length).toEqual(0);
  });
});
