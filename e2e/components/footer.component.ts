import { BaseComponent } from './base.component';

export class FooterComponent extends BaseComponent {
	readonly accessibilityStatementLink = this.page.getByRole('link', {
		name: 'Accessibility statement',
	});
	readonly privacyStatementLink = this.page.getByRole('link', {
		name: 'Privacy statement',
	});
}
