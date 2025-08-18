import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { FeatureToggleDirective } from '../feature-toggle.directive';

@Component({
	template: `
    <div id="testToggleEnabled" *featureToggleName="'testToggleEnabled'">
      <h1>This does display</h1>
    </div>
    <div id="testToggle" *featureToggleName="'testToggleDisabled'">
      <h1>This does not display</h1>
    </div>
    <div id="randomKey" *featureToggleName="'randomKey'">
      <h1>This displays</h1>
    </div>
    <div id="noToggle">
      <h1>This displays by default</h1>
    </div>
  `,
	imports: [FeatureToggleDirective],
})
class TestComponent {}

describe('FeatureToggleDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let service: FeatureToggleService;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [FeatureToggleService, HttpClient, HttpHandler],
		}).createComponent(TestComponent);

		service = TestBed.inject(FeatureToggleService);
		service.config.set({ testToggleEnabled: { enabled: true }, testToggleDisabled: { enabled: false } });

		fixture.detectChanges(); // initial binding
	});

	it('should be able to see the enabled toggled state', () => {
		const seenBox = fixture.debugElement.queryAll(By.css('#testToggleEnabled'));
		expect(seenBox).toHaveLength(1);
	});

	it('should not be able to see the disabled toggled state', () => {
		const seenBox = fixture.debugElement.queryAll(By.css('#testToggleDisabled'));
		expect(seenBox).toEqual([]);
	});

	it('should not be able to see the random key state', () => {
		const seenBox = fixture.debugElement.queryAll(By.css('#randomKey'));
		expect(seenBox).toEqual([]);
	});

	it('should be able to see with no directive', () => {
		const seenBox = fixture.debugElement.queryAll(By.css('#noToggle'));
		expect(seenBox).toHaveLength(1);
	});
});
