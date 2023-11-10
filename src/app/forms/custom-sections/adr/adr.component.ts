import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: TechRecordType<'hgv'> | TechRecordType<'trl'>;
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
    this.formChange.emit(event);
  }
}
