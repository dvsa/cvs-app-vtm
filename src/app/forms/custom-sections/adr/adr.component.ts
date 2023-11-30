import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { DateValidators } from '@forms/validators/date/date.validators';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: TechRecordType<'hgv'> | TechRecordType<'trl'> | TechRecordType<'lgv'>;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  @Output() formChange = new EventEmitter();

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
  ];

  constructor(
    private dfs: DynamicFormService,
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
    if (event == null) return;
    this.form.patchValue(event);

    const validator = DateValidators.validDate(false, 'Date processed');
    const approvedDate = this.form.get('techRecord_adrDetails_vehicleDetails_approvalDate');

    // TODO: fix underlying issue of this not being added correctly by date component
    if (!approvedDate?.hasValidator(validator)) {
      approvedDate?.addValidators(validator);
    }

    this.formChange.emit(event);
  }
}
