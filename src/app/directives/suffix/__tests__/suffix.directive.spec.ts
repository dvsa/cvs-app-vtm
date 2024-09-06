import { Component, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuffixDirective } from '../suffix.directive';

@Component({
	template: '<ng-template appSuffix></ng-template>',
})
class TestComponent {}

describe('SuffixDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SuffixDirective, TestComponent],
			providers: [TemplateRef],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
