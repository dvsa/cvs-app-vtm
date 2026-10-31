import { Locator, Page } from '@playwright/test';
import { Button } from '../../../components/button.component';
import { CheckboxGroup } from '../../../components/checkbox-group.component';
import { Checkbox } from '../../../components/checkbox.component';
import { DateInput } from '../../../components/date-input.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Select } from '../../../components/select.component';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionList, SectionRows, SectionValues, fillFields } from './section';

export class AdrSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'adr');
	}

	readonly addUnNumberButton = new Button(this.content, 'add-un-number-button');
	readonly addSubsequentInspectionButton = new Button(this.content, 'add-subsequent-inspection');

	readonly fields = {
		techRecord_adrDetails_dangerousGoods: new Radios(this.content, 'techRecord_adrDetails_dangerousGoods'),
		techRecord_adrDetails_receivedDate: new DateInput(this.content, 'techRecord_adrDetails_receivedDate'),
		techRecord_adrDetails_applicationNumber: new Input(this.content, 'techRecord_adrDetails_applicationNumber'),
		techRecord_adrDetails_applicantDetails_name: new Input(this.content, 'techRecord_adrDetails_applicantDetails_name'),
		techRecord_adrDetails_applicantDetails_street: new Input(
			this.content,
			'techRecord_adrDetails_applicantDetails_street'
		),
		techRecord_adrDetails_applicantDetails_town: new Input(this.content, 'techRecord_adrDetails_applicantDetails_town'),
		techRecord_adrDetails_applicantDetails_city: new Input(this.content, 'techRecord_adrDetails_applicantDetails_city'),
		techRecord_adrDetails_applicantDetails_postcode: new Input(
			this.content,
			'techRecord_adrDetails_applicantDetails_postcode'
		),
		techRecord_adrDetails_vehicleDetails_type: new Select(this.content, 'techRecord_adrDetails_vehicleDetails_type'),
		techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: new Radios(
			this.content,
			'techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys'
		),
		techRecord_adrDetails_vehicleDetails_approvalDate: new DateInput(
			this.content,
			'techRecord_adrDetails_vehicleDetails_approvalDate'
		),
		techRecord_adrDetails_permittedDangerousGoods: new CheckboxGroup(
			this.content,
			'techRecord_adrDetails_permittedDangerousGoods'
		),
		techRecord_adrDetails_bodyDeclaration_type: new Radios(this.content, 'techRecord_adrDetails_bodyDeclaration_type'),
		techRecord_adrDetails_compatibilityGroupJ: new Radios(this.content, 'techRecord_adrDetails_compatibilityGroupJ'),
		techRecord_adrDetails_additionalNotes_number: new CheckboxGroup(
			this.content,
			'techRecord_adrDetails_additionalNotes_number'
		),
		techRecord_adrDetails_adrTypeApprovalNo: new Input(this.content, 'techRecord_adrDetails_adrTypeApprovalNo'),
		techRecord_adrDetails_tank_tankDetails_tankManufacturer: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankManufacturer'
		),
		techRecord_adrDetails_tank_tankDetails_yearOfManufacture: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_yearOfManufacture'
		),
		techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo'
		),
		techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo'
		),
		techRecord_adrDetails_tank_tankDetails_tankCode: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankCode'
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: new Radios(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted'
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_select: new Radios(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankStatement_select'
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_statement: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankStatement_statement'
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: new SectionList(
			(index) =>
				new Input(this.content, `techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`)
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productList: new Textarea(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productList'
		),
		techRecord_adrDetails_tank_tankDetails_specialProvisions: new Textarea(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_specialProvisions'
		),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: new Input(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo'
		),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: new DateInput(
			this.content,
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate'
		),
		techRecord_adrDetails_tank_tankDetails_tc3Details: new SectionRows((index) => ({
			tc3Type: new Select(this.content, `techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3Type`),
			tc3PeriodicNumber: new Input(
				this.content,
				`techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicNumber`
			),
			tc3PeriodicExpiryDate: new DateInput(
				this.content,
				`techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicExpiryDate`
			),
		})),
		techRecord_adrDetails_memosApply: new CheckboxGroup(this.content, 'techRecord_adrDetails_memosApply'),
		techRecord_adrDetails_m145Statement: new Checkbox(this.content, 'techRecord_adrDetails_m145Statement-checkbox'),
		techRecord_adrDetails_listStatementApplicable: new Radios(
			this.content,
			'techRecord_adrDetails_listStatementApplicable'
		),
		techRecord_adrDetails_batteryListNumber: new Input(this.content, 'techRecord_adrDetails_batteryListNumber'),
		techRecord_adrDetails_brakeDeclarationsSeen: new Checkbox(
			this.content,
			'techRecord_adrDetails_brakeDeclarationsSeen-checkbox'
		),
		techRecord_adrDetails_brakeDeclarationIssuer: new Textarea(
			this.content,
			'techRecord_adrDetails_brakeDeclarationIssuer'
		),
		techRecord_adrDetails_brakeEndurance: new Checkbox(this.content, 'techRecord_adrDetails_brakeEndurance-checkbox'),
		techRecord_adrDetails_weight: new Input(this.content, 'techRecord_adrDetails_weight'),
		techRecord_adrDetails_declarationsSeen: new Checkbox(
			this.content,
			'techRecord_adrDetails_declarationsSeen-checkbox'
		),
		techRecord_adrDetails_newCertificateRequested: new Checkbox(
			this.content,
			'techRecord_adrDetails_newCertificateRequested-checkbox'
		),
		techRecord_adrDetails_additionalExaminerNotes_note: new Textarea(
			this.content,
			'techRecord_adrDetails_additionalExaminerNotes_note'
		),
		techRecord_adrDetails_adrCertificateNotes: new Textarea(this.content, 'techRecord_adrDetails_adrCertificateNotes'),
		techRecord_adrDetails_approved: new Checkbox(this.content, 'techRecord_adrDetails_approved-checkbox'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
