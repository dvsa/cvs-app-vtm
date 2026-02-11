import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { CheckboxesComponent } from '@/e2e/components/checkboxes.component';
import { DateInputComponent } from '@/e2e/components/date-input.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import {
	hasBrakeEndurance,
	hasManufacturerBrakeDeclaration,
	hasProductList,
	hasStatement,
	isAdrVehicle,
	isApprovedToCarryDangerousGoods,
	isCarryingExplosives,
	isCarryingType3Explosives,
	isPermittedUnderUNNumber,
	isTankOrBattery,
} from '@/e2e/utils/adr.utils';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class AdrSection extends BasePage {
	// Approved to carry dangerous goods
	readonly approvedToCarryDangerousGoodsRadios = new RadiosComponent(this.page, 'techRecord_adrDetails_dangerousGoods');

	// Applicant details
	readonly nameTextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_applicantDetails_name');
	readonly addressLine1TextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_applicantDetails_street');
	readonly addressLine2TextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_applicantDetails_town');
	readonly townOrCityTextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_applicantDetails_city');
	readonly postcodeTextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_applicantDetails_postcode');

	// ADR details
	readonly adrBodyType = new SelectComponent(this.page, 'techRecord_adrDetails_vehicleDetails_type');
	readonly usedOnInternationalJourneysRadios = new RadiosComponent(
		this.page,
		'techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys'
	);
	readonly dateProcessedTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_vehicleDetails_approvalDate'
	);
	readonly permittedDangerousGoodsCheckboxes = new CheckboxesComponent(
		this.page,
		'techRecord_adrDetails_permittedDangerousGoods'
	);
	readonly guidanceNotesCheckboxes = new CheckboxesComponent(this.page, 'techRecord_adrDetails_additionalNotes_number');
	readonly adrTypeApprovalNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_adrTypeApprovalNo'
	);

	// Conditional: Compatibility group J (requires a non tank/battery body type, and an explosives type 2/3 to be selected)
	readonly compatibilityGroupJRadios = new RadiosComponent(this.page, 'techRecord_adrDetails_compatibilityGroupJ');

	// Conditional: Body declaration (requires a box body type, and explosives type 3 to be selected)
	readonly bodyDeclarationRadios = new RadiosComponent(this.page, 'techRecord_adrDetails_bodyDeclaration_type');

	// Conditonal: Tank details (requires a tank/battery body type)
	readonly tankMakeTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankManufacturer'
	);
	readonly tankYearOfManufactureTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_yearOfManufacture'
	);
	readonly tankManufacturerSerialNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo'
	);
	readonly tankTypeApprovalNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo'
	);
	readonly codeTextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_tank_tankDetails_tankCode');
	readonly substancesPermittedRadios = new RadiosComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted'
	);

	// Conditional: Select (requires substances with class UN number to be selected)
	readonly selectRadios = new RadiosComponent(this.page, 'techRecord_adrDetails_select');

	// Conditional: Reference number (requires 'Statement' to be selected)
	readonly statementReferenceNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankStatement_statement'
	);

	// Conditional: Reference number and UN number 1 (requires 'Product list' to be selected)
	readonly productListReferenceNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'
	);
	readonly unNumber1TextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_unNumber1');
	readonly addUNNumberButton = this.page.getByRole('button', { name: 'Add UN number' });
	readonly additionalDetailsTextarea = new TextareaComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tankStatement_productList'
	);

	// Conditional: Special provisions (required tank/battery body type)
	readonly specialProvisionsTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_specialProvisions'
	);

	// Conditional: Tank inspections (requires a tank/battery body type)
	readonly tc2CertificateNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo'
	);
	readonly tc2ExpiryDateDateInput = new DateInputComponent(
		this.page,
		'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate'
	);
	readonly addSubsequentInspectionButton = this.page.getByRole('button', { name: 'Add subsequent inspection' });

	// Conditional: Memo 07/09 (3 month extension) can be applied (requires a tank/battery body type)
	readonly memoCheckboxes = new CheckboxesComponent(this.page, 'techRecord_adrDetails_memosApply');

	// Conditional: M145 (requires a tank/battery body type)
	readonly m145Checkbox = new CheckboxComponent(this.page, 'techRecord_adrDetails_m145Statement');

	// Declarations
	readonly manufacturerBrakeDeclarationCheckbox = new CheckboxComponent(
		this.page,
		'techRecord_adrDetails_brakeDeclarationsSeen'
	);
	readonly issuerTextarea = new TextareaComponent(this.page, 'techRecord_adrDetails_brakeDeclarationIssuer');
	readonly brakeEnduranceCheckbox = new CheckboxComponent(this.page, 'techRecord_adrDetails_brakeEndurance');
	readonly weightTextInput = new TextInputComponent(this.page, 'techRecord_adrDetails_weight');
	readonly ownerOperatorDeclarationCheckbox = new CheckboxComponent(
		this.page,
		'techRecord_adrDetails_declarationsSeen'
	);

	// New certifcate required
	readonly newCertificateRequiredCheckbox = new CheckboxComponent(
		this.page,
		'techRecord_adrDetails_newCertificateRequested'
	);

	// Notes
	readonly additionalExaminerNotesTextarea = new TextareaComponent(
		this.page,
		'techRecord_adrDetails_additionalExaminerNotes'
	);
	readonly adrCertificateNotes = new TextareaComponent(this.page, 'techRecord_adrDetails_adrCertificateNotes');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (isAdrVehicle(data)) {
			// Set ADR details
			await this.approvedToCarryDangerousGoodsRadios.fill(data.techRecord_adrDetails_dangerousGoods);

			// Populate subsections if approved to carry dangerous goods is true
			if (isApprovedToCarryDangerousGoods(data)) {
				// Populate applicant details
				await this.nameTextInput.fill(data.techRecord_adrDetails_applicantDetails_name);
				await this.addressLine1TextInput.fill(data.techRecord_adrDetails_applicantDetails_street);
				await this.addressLine2TextInput.fill(data.techRecord_adrDetails_applicantDetails_town);
				await this.townOrCityTextInput.fill(data.techRecord_adrDetails_applicantDetails_city);
				await this.postcodeTextInput.fill(data.techRecord_adrDetails_applicantDetails_postcode);

				// Populate ADR details
				await this.adrBodyType.fill(data.techRecord_adrDetails_vehicleDetails_type);
				await this.usedOnInternationalJourneysRadios.fill(
					data.techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys
				);
				await this.dateProcessedTextInput.fill(data.techRecord_adrDetails_vehicleDetails_approvalDate);
				await this.permittedDangerousGoodsCheckboxes.fill(data.techRecord_adrDetails_permittedDangerousGoods);
				await this.guidanceNotesCheckboxes.fill(data.techRecord_adrDetails_additionalNotes_number);
				await this.adrTypeApprovalNumberTextInput.fill(data.techRecord_adrDetails_adrTypeApprovalNo);

				// Populate compatibility group J
				if (isCarryingExplosives(data)) {
					await this.compatibilityGroupJRadios.fill(data.techRecord_adrDetails_compatibilityGroupJ);
				}

				// Populate body declaration
				if (isCarryingType3Explosives(data)) {
					await this.bodyDeclarationRadios.fill(data.techRecord_adrDetails_bodyDeclaration_type);
				}

				// Populate tank details
				if (isTankOrBattery(data)) {
					await this.tankMakeTextInput.fill(data.techRecord_adrDetails_tank_tankDetails_tankManufacturer);
					await this.tankYearOfManufactureTextInput.fill(data.techRecord_adrDetails_tank_tankDetails_yearOfManufacture);
					await this.tankManufacturerSerialNumberTextInput.fill(
						data.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo
					);
					await this.tankTypeApprovalNumberTextInput.fill(data.techRecord_adrDetails_tank_tankDetails_tankTypeAppNo);
					await this.codeTextInput.fill(data.techRecord_adrDetails_tank_tankDetails_tankCode);
					await this.substancesPermittedRadios.fill(
						data.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted
					);

					if (isPermittedUnderUNNumber(data)) {
						if (hasStatement(data)) {
							await this.statementReferenceNumberTextInput.fill(
								data.techRecord_adrDetails_tank_tankDetails_tankStatement_statement
							);
						}
						if (hasProductList(data)) {
							await this.productListReferenceNumberTextInput.fill(
								data.techRecord_adrDetails_tank_tankDetails_tankStatement_productList
							);

							// Populate UN numbers
							const unNumbers = data.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
							if (Array.isArray(unNumbers)) {
								for (const [index, unNumber] of unNumbers.entries()) {
									const textInput = new TextInputComponent(
										this.page,
										`techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`
									);

									// If UN number input is not visible, attempt to add it
									const isVisible = await textInput.input.isVisible();
									if (!isVisible) {
										await this.addUNNumberButton.click();
									}
									await textInput.fill(unNumber);
								}
							}

							// Populate additional details
							await this.additionalDetailsTextarea.fill(
								data.techRecord_adrDetails_tank_tankDetails_tankStatement_productList
							);
						}
					}

					// Populate special provisions
					await this.specialProvisionsTextInput.fill(data.techRecord_adrDetails_tank_tankDetails_specialProvisions);

					// Populate TC2 tank inspection details
					await this.tc2CertificateNumberTextInput.fill(
						data.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo
					);
					await this.tc2ExpiryDateDateInput.fill(
						data.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate
					);

					// Populate TC3 subsequent inspection details
					const subsequentInspections = data.techRecord_adrDetails_tank_tankDetails_tc3Details;
					if (Array.isArray(subsequentInspections)) {
						for (const [index, inspection] of subsequentInspections.entries()) {
							const inspectionTypeSelect = new SelectComponent(
								this.page,
								`techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3Type`
							);
							const certificateNumberTextInput = new TextInputComponent(
								this.page,
								`techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicNumber`
							);
							const expiryDateDateInput = new DateInputComponent(
								this.page,
								`techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicExpiryDate`
							);

							// If controls for subsequent inspection are not visible, attempt to add it
							const isVisible = await inspectionTypeSelect.select.isVisible();
							if (!isVisible) {
								await this.addSubsequentInspectionButton.click();
							}

							await inspectionTypeSelect.fill(inspection.tc3Type);
							await certificateNumberTextInput.fill(inspection.tc3PeriodicNumber);
							await expiryDateDateInput.fill(inspection.tc3PeriodicExpiryDate);
						}
					}

					// Populate Memo 07/09 (3 month extension) can be applied
					await this.memoCheckboxes.fill(data.techRecord_adrDetails_memosApply);

					// Populate M145
					await this.m145Checkbox.fill(data.techRecord_adrDetails_m145Statement);
				}

				// Populate declarations
				await this.manufacturerBrakeDeclarationCheckbox.fill(data.techRecord_adrDetails_brakeDeclarationsSeen);
				if (hasManufacturerBrakeDeclaration(data)) {
					await this.issuerTextarea.fill(data.techRecord_adrDetails_brakeDeclarationIssuer);
					await this.brakeEnduranceCheckbox.fill(data.techRecord_adrDetails_brakeEndurance);
					if (hasBrakeEndurance(data)) {
						await this.weightTextInput.fill(data.techRecord_adrDetails_weight);
					}
				}
				await this.ownerOperatorDeclarationCheckbox.fill(data.techRecord_adrDetails_declarationsSeen);

				// Populate new certificate required
				await this.newCertificateRequiredCheckbox.fill(data.techRecord_adrDetails_newCertificateRequested);

				// Populate notes
				await this.additionalExaminerNotesTextarea.fill(data.techRecord_adrDetails_additionalExaminerNotes?.[0]?.note);
				await this.adrCertificateNotes.fill(data.techRecord_adrDetails_adrCertificateNotes);
			}
		}
	}
}
