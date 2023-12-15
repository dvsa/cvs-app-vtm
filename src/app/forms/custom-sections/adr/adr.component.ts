import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { AdrSummaryTemplate } from '@forms/templates/general/adr-summary.template';
import { DateValidators } from '@forms/validators/date/date.validators';
import { ReplaySubject, skipWhile, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit, OnDestroy {
  @Input() techRecord!: TechRecordType<'hgv'> | TechRecordType<'trl'> | TechRecordType<'lgv'>;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  @Input() isReviewScreen = false;

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
    'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
    'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
    'techRecord_adrDetails_tank_tankDetails_tankStatement_statement',
    'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
    'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
    'techRecord_adrDetails_tank_tankDetails_tankStatement_productList',
    'techRecord_adrDetails_tank_tankDetails_specialProvisions',
    'techRecord_adrDetails_brakeDeclarationsSeen',
    'techRecord_adrDetails_brakeDeclarationIssuer',
    'techRecord_adrDetails_brakeEndurance',
    'techRecord_adrDetails_weight',
    'techRecord_adrDetails_declarationsSeen',
  ];

  destroy$ = new ReplaySubject<boolean>(1);

  constructor(
    private dfs: DynamicFormService,
    private technicalRecordService: TechnicalRecordService,
    private globalErrorService: GlobalErrorService,
  ) { }

  ngOnInit(): void {
    if (this.isReviewScreen) {
      this.template = AdrSummaryTemplate;
    }
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.checkForAdrFields();
    this.checkForTankStatement();
    this.handleSubmit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  checkForTankStatement() {
    if (this.checkForTankStatementSelectFlag()) {
      return;
    }

    const { techRecord_adrDetails_tank_tankDetails_tankStatement_statement: statement } = this.techRecord;
    if (statement) {
      this.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select = ADRTankDetailsTankStatementSelect.STATEMENT;
    }

    const {
      techRecord_adrDetails_tank_tankDetails_tankStatement_productList: productList,
      techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: productListUnNo,
      techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: productListRefNo,
    } = this.techRecord;
    if (productList || productListRefNo || (productListUnNo && productListUnNo.length > 0)) {
      this.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select = ADRTankDetailsTankStatementSelect.PRODUCT_LIST;
    }
  }

  checkForTankStatementSelectFlag(): boolean {
    return Object.keys(this.techRecord).includes('techRecord_adrDetails_tank_tankDetails_tankStatement_select');
  }

  handleFormChange(event: Record<string, unknown>) {
    if (event == null) return;
    if (this.techRecord == null) return;

    const validator = DateValidators.validDate(false, 'Date processed');
    const approvedDate = this.form.get('techRecord_adrDetails_vehicleDetails_approvalDate');

    // TODO: fix underlying issue of this not being added correctly by date component
    if (!approvedDate?.hasValidator(validator)) {
      approvedDate?.addValidators(validator);
    }

    this.form.patchValue(event);
    this.technicalRecordService.updateEditingTechRecord({ ...this.techRecord, ...event } as TechRecordTypeVerb<'put'>);
  }

  handleSubmit() {
    this.globalErrorService.errors$.pipe(takeUntil(this.destroy$), skipWhile((errors) => errors.length === 0)).subscribe(() => {
      document.querySelectorAll(`
          a[href]:not([tabindex='-1']),
          area[href]:not([tabindex='-1']),
          input:not([disabled]):not([tabindex='-1']),
          select:not([disabled]):not([tabindex='-1']),
          textarea:not([disabled]):not([tabindex='-1']),
          button:not([disabled]):not([tabindex='-1']),
          iframe:not([tabindex='-1']),
          [tabindex]:not([tabindex='-1']),
          [contentEditable=true]:not([tabindex='-1'])
      `)
        .forEach((element) => {
          if (element instanceof HTMLElement) {
            element.focus();
            element.blur();
          }
        });
    });
  }
}
