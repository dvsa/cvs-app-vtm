import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterByTagsDirective } from '../filter-by-tags.directive';
@Component({
	template: `<input appFilterByTags [filters]="filters()" [tagNames]="['Plates', 'Required']">`,
	imports: [FilterByTagsDirective],
})
class TestComponent {
	filters = input<string[]>([]);
}

describe('FilterByTagsDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let inputEl: HTMLInputElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent, FilterByTagsDirective],
		});

		fixture = TestBed.createComponent(TestComponent);
		inputEl = fixture.debugElement.query(By.directive(FilterByTagsDirective)).nativeElement;
	});

	it('should be visible when no filters are applied', () => {
		fixture.componentRef.setInput('filters', []);
		fixture.detectChanges();
		fixture.whenRenderingDone().then(() => {
			expect(inputEl.style.display).toBe('initial');
		});
	});

	it('should be hidden when a filter is applied that is not in the tags', () => {
		fixture.componentRef.setInput('filters', ['ADR']);
		fixture.detectChanges();
		fixture.whenRenderingDone().then(() => {
			expect(inputEl.style.display).toBe('none');
		});
	});

	it('should be visible when a filter is applied that is in the tags', () => {
		fixture.componentRef.setInput('filters', ['Plates', 'ADR']);
		fixture.detectChanges();
		fixture.whenRenderingDone().then(() => {
			expect(inputEl.style.display).toBe('initial');
		});
	});

	it('should be visible when multiple matching filters are applied', () => {
		fixture.componentRef.setInput('filters', ['Plates', 'Required']);
		fixture.detectChanges();
		fixture.whenRenderingDone().then(() => {
			expect(inputEl.style.display).toBe('initial');
		});
	});
});
