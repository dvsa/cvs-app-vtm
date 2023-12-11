import {
  Component,
  Input, OnInit, ViewChildren,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { AdrTankDetailsSubsequentInspectionsComponent } from '../adr-tank-details-subsequent-inspections/adr-tank-details-subsequent-inspections.component';

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
  ];

  @ViewChildren(AdrTankDetailsSubsequentInspectionsComponent) formArray?: FormArray;

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
    if (event == null) return;
    if (this.techRecord == null) return;

    this.form.patchValue(event);
    this.technicalRecordService.updateEditingTechRecord({ ...this.techRecord, ...event } as TechRecordTypeVerb<'put'>);
  }
}
