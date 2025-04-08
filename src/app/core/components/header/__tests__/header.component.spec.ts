import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from '../header.component';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let userNameText: HTMLElement;
	let logOutButton: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		userNameText = fixture.debugElement.nativeElement.querySelector('#username');
		logOutButton = fixture.debugElement.query(By.css('#sign-out'));
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Change username updates page', () => {
		fixture.componentRef.setInput('username', 'Test');
		fixture.detectChanges();
		expect(userNameText.innerHTML).toBe('Test');
	});

	it('Clicking logout fires off event', (done) => {
		component.logOutEvent.subscribe(() => {
			done();
			expect(done).toHaveBeenCalled();
		});

		logOutButton.triggerEventHandler('click', null);
	});
});
