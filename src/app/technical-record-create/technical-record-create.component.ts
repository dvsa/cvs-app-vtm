import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  SetVehicleTechRecordModelVinOnCreate
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {CreateTechRecordVM} from '@app/store/state/VehicleTechRecordModel.state';

@Component({
  selector: 'vtm-technical-record-create',
  templateUrl: './technical-record-create.component.html',
  styleUrls: ['./technical-record-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordCreateComponent implements OnInit {
  vehicleTypes = ['PSV', 'HGV', 'Trailer'];
  createTechRecordForm: FormGroup;

  constructor(private _store: Store<IAppState>) {
  }

  ngOnInit() {
    this.createTechRecordForm = new FormGroup({
      'vehicleType': new FormControl('PSV', Validators.required),
      'vin': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(21)]),
      'vrm': new FormControl('')
    });
  }

  setVrmValidators($event): void {
    const vrmControl = this.createTechRecordForm.get('vrm');

    if ($event.currentTarget.value === 'PSV' || $event.currentTarget.value === 'HGV') {
      vrmControl.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(8)]);
    } else {
      vrmControl.setValidators([Validators.minLength(1), Validators.maxLength(8)]);
    }
    vrmControl.updateValueAndValidity();
  }

  onSubmit() {
    const createDetails: CreateTechRecordVM = {
      vin: this.createTechRecordForm.get('vin').value,
      vrm: this.createTechRecordForm.get('vrm').value,
      vType: this.createTechRecordForm.get('vehicleType').value
    };

    this._store.dispatch(new SetVehicleTechRecordModelVinOnCreate(createDetails));
  }

}
