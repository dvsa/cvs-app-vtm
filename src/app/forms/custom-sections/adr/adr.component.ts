import {
  Component,
  Input, OnInit,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { DateValidators } from '@forms/validators/date/date.validators';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: TechRecordType<'hgv'> | TechRecordType<'trl'> | TechRecordType<'lgv'>;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;

  public template = AdrTemplate;
  public form!: CustomFormGroup;
  public adrDetails = [
    'techRecord_adrDetails_applicantDetails_city',
    'techRecord_adrDetails_applicantDetails_name',
    'techRecord_adrDetails_applicantDetails_postcode',
    'techRecord_adrDetails_applicantDetails_town',
    'techRecord_adrDetails_applicantDetails_street',
    'techRecord_adrDetails_vehicleDetails_type',
    'techRecord_adrDetails_vehicleDetails_approvalDate',
    'techRecord_adrDetails_permittedDangerousGoods',
    'techRecord_adrDetails_compatibilityGroupJ',
    'techRecord_adrDetails_additionalNotes_number',
    'techRecord_adrDetails_adrTypeApprovalNo',
    'techRecord_adrDetails_tank_tankDetails_tankManufacturer',
    'techRecord_adrDetails_tank_tankDetails_yearOfManufacture',
    'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo',
    'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo',
    'techRecord_adrDetails_tank_tankDetails_tankCode',
    'techRecord_adrDetails_brakeDeclarationsSeen',
    'techRecord_adrDetails_brakeDeclarationIssuer',
    'techRecord_adrDetails_brakeEndurance',
    'techRecord_adrDetails_weight',
    'techRecord_adrDetails_declarationsSeen',
  ];

  constructor(
    private dfs: DynamicFormService,
    private technicalRecordService: TechnicalRecordService,
  ) { }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.checkForAdrFields();
  }

  checkForAdrFields() {
    if (this.checkForDangerousGoodsFlag()) {
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const adrDetail of this.adrDetails) {
      if (Object.keys(this.techRecord).includes(adrDetail)) {
        this.techRecord.techRecord_adrDetails_dangerousGoods = true;
        break;
      }
    }
  }

  checkForDangerousGoodsFlag(): boolean {
    return Object.keys(this.techRecord).includes('techRecord_adrDetails_dangerousGoods');
  }

  handleFormChange(event: Record<string, unknown>) {
    console.log(event);
    if (event == null) return;
    if (this.techRecord == null) return;
    this.form.patchValue(event);

    const validator = DateValidators.validDate(false, 'Date processed');
    const approvedDate = this.form.get('techRecord_adrDetails_vehicleDetails_approvalDate');

    // TODO: fix underlying issue of this not being added correctly by date component
    if (!approvedDate?.hasValidator(validator)) {
      approvedDate?.addValidators(validator);
    }

    this.technicalRecordService.updateEditingTechRecord({ ...this.techRecord, ...event } as TechRecordTypeVerb<'put'>);
  }
}
