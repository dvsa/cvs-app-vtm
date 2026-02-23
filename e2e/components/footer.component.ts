import { BaseComponent } from './base.component';

export class FooterComponent extends BaseComponent {
	readonly accessibilityStatementLink = this.page.getByRole('anchor', {
		text: 'Accessibility statement',
	});
	readonly privacyStatementLink = this.page.getByRole('anchor', {
		text: 'Privacy statement',
	});
}
