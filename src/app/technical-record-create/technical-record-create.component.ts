import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetVehicleTechRecordModelOnCreate } from '@app/store/actions/VehicleTechRecordModel.actions';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { Observable } from 'rxjs';
import { CREATE_PAGE_LABELS } from '@app/app.enums';
import { VehicleIdentifiers } from '@app/models/vehicle-tech-record.model';
import { getErrors } from '@app/store/selectors/error.selectors';
import { SetErrorMessage } from '@app/store/actions/Error.actions';

@Component({
  selector: 'vtm-technical-record-create',
  templateUrl: './technical-record-create.component.html',
  styleUrls: ['./technical-record-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordCreateComponent implements OnInit {
  vehicleTypes = ['PSV', 'HGV', 'Trailer'];
  createTechRecordForm: FormGroup;
  formError$: Observable<any>;
  formErrors: { vinErr: string; vrmErr: string; vTypeErr: string; requestErr: string[] } = {
    vinErr: '',
    vrmErr: '',
    vTypeErr: '',
    requestErr: []
  };
  vrmLabel = CREATE_PAGE_LABELS.CREATE_VRM_LABEL;

  constructor(private _store: Store<IAppState>) {
    this.formError$ = this._store.select(getErrors);
  }

  ngOnInit() {
    this.createTechRecordForm = new FormGroup({
      vehicleType: new FormControl('', Validators.required),
      vin: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(21)
      ]),
      vrm: new FormControl('', Validators.required)
    });
  }

  setVrmValidators($event): void {
    const vrmControl = this.createTechRecordForm.get('vrm');

    if (
      $event.currentTarget.id === 'test-radio-PSV' ||
      $event.currentTarget.id === 'test-radio-HGV'
    ) {
      this.vrmLabel = CREATE_PAGE_LABELS.CREATE_VRM_LABEL;
      vrmControl.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(8)
      ]);
    } else {
      this.vrmLabel = CREATE_PAGE_LABELS.CREATE_VRM_LABEL_OPTIONAL;
      vrmControl.setValidators([Validators.minLength(1), Validators.maxLength(8)]);
    }
    vrmControl.updateValueAndValidity();
  }

  onSubmit() {
    this.formErrors.vinErr = !this.createTechRecordForm.get('vin').valid ? 'Enter a VIN' : '';
    this.formErrors.vrmErr = !this.createTechRecordForm.get('vrm').valid ? 'Enter a VRM' : '';
    this.formErrors.vTypeErr = !this.createTechRecordForm.get('vehicleType').valid
      ? 'Select a vehicle type'
      : '';

    if (!this.formErrors.vinErr && !this.formErrors.vrmErr && !this.formErrors.vTypeErr) {
      const createDetails: VehicleIdentifiers = {
        vin: this.createTechRecordForm.get('vin').value,
        vrm: this.createTechRecordForm.get('vrm').value,
        vType: this.createTechRecordForm.get('vehicleType').value
      };
      this.formErrors.requestErr = [];
      this._store.dispatch(new SetVehicleTechRecordModelOnCreate(createDetails));
    } else {
      const errors = [this.formErrors.vinErr, this.formErrors.vrmErr, this.formErrors.vTypeErr];
      this._store.dispatch(new SetErrorMessage(errors));
    }

    setTimeout(function() {
      document.getElementById('test-vin').focus();
      document.getElementById('test-vrm').focus();
    }, 300);
  }
}
