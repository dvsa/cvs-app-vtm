import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { RoleRequiredDirective } from '../app-role-required.directive';

@Component({
	template: `
    <div id="displayBox" *appRoleRequired="Roles.TechRecordView">
      <h1>This can display</h1>
    </div>
    <div id="displayEitherRoleBox" *appRoleRequired="[Roles.TechRecordAmend, Roles.TestResultView]">
      <h1>This displays on either role</h1>
    </div>
    <div id="hiddenBox" *appRoleRequired="Roles.TechRecordCreate">
      <h1>This cannot display</h1>
    </div>
    <div id="errorBox" *appRoleRequired="ThisIsNotFromTheRolesEnum">
      <h1>This is an error case</h1>
    </div>
  `,
	imports: [RoleRequiredDirective],
})
class TestComponent {
	public get Roles() {
		return Roles;
	}
}

describe('RoleRequiredDirective', () => {
	const userRoles: string[] = ['TechRecord.View'];
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { roles$: of(userRoles) } },
			],
		}).createComponent(TestComponent);

		fixture.detectChanges(); // initial binding
	});

	it('should display the element', () => {
		const seenBox = fixture.debugElement.queryAll(By.css('#displayBox'));
		expect(seenBox).toHaveLength(1);
	});

	it('should hide the element', () => {
		const hiddenBox = fixture.debugElement.queryAll(By.css('#hiddenBox'));
		expect(hiddenBox).toHaveLength(0);
	});

	it('should hide the element if the role needed is invalid (i.e. not from the Roles enum)', () => {
		const errorBox = fixture.debugElement.queryAll(By.css('#errorBox'));
		expect(errorBox).toHaveLength(0);
	});
});

describe('RoleRequiredDirective with multiple optional roles', () => {
	it.each([[['TestResult.View']], [['TechRecord.Amend']]])(
		'should show the element when either role is present',
		(user) => {
			const fixture: ComponentFixture<TestComponent> = TestBed.configureTestingModule({
				imports: [TestComponent],
				providers: [
					provideMockStore({ initialState: initialAppState }),
					{ provide: UserService, useValue: { roles$: of(user) } },
				],
			}).createComponent(TestComponent);

			fixture.detectChanges(); // initial binding

			const seenBox = fixture.debugElement.queryAll(By.css('#displayEitherRoleBox'));
			expect(seenBox).toHaveLength(1);
		}
	);
});

describe('RoleRequiredDirective without roles', () => {
	it('should hide the element when no roles are available', () => {
		const fixture: ComponentFixture<TestComponent> = TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { roles$: of(null) } },
			],
		}).createComponent(TestComponent);

		fixture.detectChanges(); // initial binding

		const seenBox = fixture.debugElement.queryAll(By.css('#errorBox'));
		expect(seenBox).toHaveLength(0);
	});
});
