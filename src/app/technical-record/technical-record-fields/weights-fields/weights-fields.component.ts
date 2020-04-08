import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-weights-fields',
  templateUrl: './weights-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl('grossGbWeight', this.fb.control(''));
    this.technicalRecord.addControl('grossEecWeight', this.fb.control(''));
    this.technicalRecord.addControl('grossDesignWeight', this.fb.control(''));

    this.technicalRecord.addControl('trainGbWeight', this.fb.control(''));
    this.technicalRecord.addControl('trainEecWeight', this.fb.control(''));
    this.technicalRecord.addControl('trainDesignWeight', this.fb.control(''));

    this.technicalRecord.addControl('maxTrainGbWeight', this.fb.control(''));
    this.technicalRecord.addControl('maxTrainEecWeight', this.fb.control(''));
    this.technicalRecord.addControl('maxTrainDesignWeight', this.fb.control(''));

    this.technicalRecord.addControl('axles', this.buildAxlesArrayGroup([]));
  }

  buildAxlesArrayGroup(data) {
    return this.fb.array(data.map(this.buildAxelGroup.bind(this)));
  }

  buildAxelGroup(data = {}): FormGroup {
    return this.fb.group({
      weights: this.fb.group({
        gbWeight: this.fb.control('gbWeight'),
        eecWeight: this.fb.control('eecWeight'),
        designWeight: this.fb.control('designWeight')
      })
    });
  }
}
