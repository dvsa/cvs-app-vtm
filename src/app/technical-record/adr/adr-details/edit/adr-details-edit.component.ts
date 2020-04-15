import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormArray, Validators } from '@angular/forms';
import { tap, takeUntil, debounceTime } from 'rxjs/operators';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import { AdrDetails } from '@app/models/adr-details';
import { MetaData } from '@app/models/meta-data';
import { EXPLOSIVE_TYPES } from './../../adr.constants';
import { BOOLEAN_RADIO_OPTIONS } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-adr-details-edit',
  templateUrl: './adr-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsEditComponent extends AdrComponent implements OnInit {
  submitted: boolean;
  selectedVehicleType: string;
  defaultVehicleType: SelectOption;
  vehicleTypeOptions: SelectOption[];
  vehicleTypeDefault: string;
  approvalDate: string;
  showCompatibilityGroupJ: boolean;
  permittedDangerousGoodsOptions: SelectOption[];
  explosive_types = EXPLOSIVE_TYPES;
  guidanceNotesOptions: SelectOption[];
  options = BOOLEAN_RADIO_OPTIONS;
  adrForm: FormGroup;

  @Input() adrDetails: AdrDetails;
  @Input() metaData: MetaData;

  get vehicleDetails() {
    return this.adrForm.get('vehicleDetails') as FormGroup;
  }

  get permittedDangerousGoods() {
    return this.adrForm.get('permittedDangerousGoods') as FormArray;
  }

  get additionalNotes() {
    return this.adrForm.get('additionalNotes') as FormGroup;
  }

  get number() {
    return this.additionalNotes.get('number') as FormArray;
  }

  ngOnInit(): void {
    this.adrForm = super.setUp();

    this.vehicleTypeOptions = new DisplayOptionsPipe().transform(
      this.metaData.adrDetails.vehicleDetails.typeFe
    );

    const { vehicleDetails } = this.adrDetails;
    if (vehicleDetails && vehicleDetails.type) {
      const defaultType: SelectOption = this.vehicleTypeOptions.find(
        (type) => type.name.toLowerCase() === this.adrDetails.vehicleDetails.type.toLowerCase()
      );
      this.vehicleTypeDefault = !!defaultType ? defaultType.name.toLowerCase() : '';
    }

    if (vehicleDetails && vehicleDetails.approvalDate) {
      this.approvalDate = vehicleDetails.approvalDate;
    }

    // const selectedDangerousGoods = ['Explosives (type 2)', 'Explosives (type 3)'];
    const selectedDangerousGoods = this.adrDetails.permittedDangerousGoods
      ? this.adrDetails.permittedDangerousGoods
      : [];
    this.permittedDangerousGoodsOptions = new DisplayOptionsPipe().transform(
      this.metaData.adrDetails.permittedDangerousGoodsFe,
      selectedDangerousGoods
    );
    this.showCompatibilityGroupJ = this.hasGoodsWithCompatibilityGroupJ(
      this.permittedDangerousGoodsOptions
    );

    const selectedGuidanceNotes =
      this.adrDetails.additionalNotes && this.adrDetails.additionalNotes.number
        ? this.adrDetails.additionalNotes.number
        : [];
    this.guidanceNotesOptions = new DisplayOptionsPipe().transform(
      this.metaData.adrDetails.additionalNotes.numberFe,
      selectedGuidanceNotes
    );

    this.initControls();
    this.handleFormChanges();
  }

  initControls() {
    this.adrForm.addControl(
      'vehicleDetails',
      this.fb.group({
        type: this.fb.control(this.vehicleTypeDefault, [Validators.required]),
        approvalDate: this.fb.control(this.approvalDate, [Validators.required])
      })
    );

    this.adrForm.addControl(
      'permittedDangerousGoods',
      this.fb.array(this.mapToFormGroup(this.permittedDangerousGoodsOptions), [
        Validators.required
      ])
    );

    this.adrForm.addControl(
      'compatibilityGroupJ',
      this.fb.control(this.adrDetails.compatibilityGroupJ)
    );

    this.adrForm.addControl(
      'adrTypeApprovalNo',
      this.fb.control(this.adrDetails.adrTypeApprovalNo)
    );

    this.adrForm.addControl(
      'additionalNotes',
      this.fb.group({
        number: this.fb.array(this.mapToFormGroup(this.guidanceNotesOptions))
      })
    );
  }

  mapToFormGroup(options: SelectOption[]): FormGroup[] {
    return options.map((option) => {
      return this.fb.group({
        name: option.name,
        selected: option.selected
      });
    });
  }

  hasGoodsWithCompatibilityGroupJ(goodsOptions: SelectOption[]): boolean {
    return goodsOptions.some(
      (option) => option.selected && this.explosive_types.includes(option.name)
    );
  }

  unsorted(): number {
    return super.unsorted();
  }

  handleFormChanges() {
    this.vehicleTypeChanges();
    this.permittedDangerousGoodsChanges();
  }

  vehicleTypeChanges() {
    this.vehicleDetails
      .get('type')
      .valueChanges.pipe(
        debounceTime(1000),
        tap((value) => {
          super.vehicleTypeChangedHandler(value);
        })
      )
      .subscribe();
  }

  permittedDangerousGoodsChanges() {
    this.permittedDangerousGoods.valueChanges
      .pipe(
        tap((items: SelectOption[]) => {
          this.showCompatibilityGroupJ = this.hasGoodsWithCompatibilityGroupJ(items);
          if (!this.showCompatibilityGroupJ) {
            // reset regardless
            this.adrForm.get('compatibilityGroupJ').reset(false);
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }
}
