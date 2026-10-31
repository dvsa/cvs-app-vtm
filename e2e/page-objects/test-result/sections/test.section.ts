import { Locator, Page } from '@playwright/test';
import { Button } from '../../../components/button.component';
import { CheckboxGroup } from '../../../components/checkbox-group.component';
import { DateInput } from '../../../components/date-input.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Section, SectionValues, fillFields } from '../../../components/section.component';
import { Select } from '../../../components/select.component';
import { Textarea } from '../../../components/textarea.component';

export class TestSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'test');
	}

	readonly generateCertificateButton = new Button(this.content, 'submit-adr-cert-form');
	readonly viewCertificateButton = new Button(this.content, 'view-button');

	readonly fields = {
		contingencyTestNumber: new Input(this.content, 'contingencyTestNumber'),
		certificateNumber: new Input(this.content, 'certificateNumber'),
		testTypeName: new Input(this.content, 'testTypeName'),
		testResult: new Radios(this.content, 'testResult'),
		issueRequired: new Radios(this.content, 'issueRequired'),
		testExpiryDate: new DateInput(this.content, 'testExpiryDate'),
		testAnniversaryDate: new DateInput(this.content, 'testAnniversaryDate'),
		testTypeStartTimestamp: new DateInput(this.content, 'testTypeStartTimestamp'),
		testTypeEndTimestamp: new DateInput(this.content, 'testTypeEndTimestamp'),
		prohibitionIssued: new Radios(this.content, 'prohibitionIssued'),
		reapplicationDate: new DateInput(this.content, 'reapplicationDate'),
		reasonForAbandoning: new CheckboxGroup(this.content, 'reasonForAbandoning'),
		additionalCommentsForAbandon: new Textarea(this.content, 'additionalCommentsForAbandon'),
		vehicleLoadStatus: new Radios(this.content, 'vehicleLoadStatus'),
		unladenBodyType: new Select(this.content, 'unladenBodyType'),
		otherUnladenBodyType: new Input(this.content, 'otherUnladenBodyType'),
		reasonForNotLoading: new Select(this.content, 'reasonForNotLoading'),
		otherReasonForNotLoading: new Textarea(this.content, 'otherReasonForNotLoading'),
		partiallyLadenReason: new Textarea(this.content, 'partiallyLadenReason'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
