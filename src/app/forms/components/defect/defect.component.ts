import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomFormGroup, FormNodeOption } from '@forms/services/dynamic-form.types';
import { AdditionalInfoSection } from '@models/defects/additional-information.model';
import { Defect } from '@models/defects/defect.model';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
  selector: 'app-defect[form][index][defect][vehicleType]',
  templateUrl: './defect.component.html',
  providers: [DefaultNullOrEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectComponent {
  @Input() form!: CustomFormGroup;
  @Input() vehicleType!: VehicleTypes;
  @Input() category!: string;
  @Input() isEditing = false;
  @Input() index!: number;

  @Input() set defect(defect: Defect | undefined) {
    const infoShorthand = defect?.additionalInfo;

    if (!infoShorthand) { return }

    this.info = defect?.additionalInfo[this.vehicleType as keyof typeof infoShorthand] as AdditionalInfoSection | undefined;

    if (this.info && !this.isAdvisory) {
      const location = this.info.location;
      type LocationKey = keyof typeof location;

      Object.keys(location).forEach(key => {
        const options = location[key as LocationKey];
        if (options) {
          this.infoDictionary[key] = this.mapOptions(options);
        }
      });
    }
  }

  @Output() removeDefect = new EventEmitter<number>();

  info?: AdditionalInfoSection;

  infoDictionary: Record<string, Array<FormNodeOption<any>>> = {};

  booleanOptions: FormNodeOption<string | number | boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  constructor(private pipe: DefaultNullOrEmpty) {}

  get isAdvisory(): Boolean {
    return this.category === 'advisory';
  }

  get isDangerous(): Boolean {
    return this.category === 'dangerous';
  }

  trackByFn = (_index: number, keyValuePair: KeyValue<string, Array<any>>): string => keyValuePair.key;

  mapOptions = (options: Array<any>): Array<FormNodeOption<any>> => options.map(option => ({ value: option, label: this.pascalCase(String(option)) }));

  pascalCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');

  combined = (...params: string[]): string => params.map(p => this.pipe.transform(p)).join(' / ');

  /**
   * takes the location object where all properties are optional and returns a string with all the properties that have values separated with ` / `.
   * While we don't know how to format the string, we show the properties as `key: value`.
   * TODO: update string format once we have service design.
   * @param location - DefectAdditionalInformationLocation object
   * @returns string
   */
  mapLocationText = (location: DefectAdditionalInformationLocation): string => !location
    ? '-'
    : Object.entries(location)
      .filter(([, value]) => (typeof value === 'number' && isNaN(value) === false) || value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' / ');
}
