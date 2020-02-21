import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  SetVehicleTechRecordModelVinOnCreate
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {CreateTechRecordVM} from '@app/store/state/VehicleTechRecordModel.state';
import {Observable} from 'rxjs';


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
  formErrors: { vinErr: string, vrmErr: string, vTypeErr: string, requestErr: string[] } = { vinErr: '', vrmErr: '', vTypeErr: '', requestErr: [''] };
  hasErrors = false;
  hasVinReqErrors;
  hasVrmReqErrors ;

  constructor(private _store: Store<IAppState>) {
    this.formError$ = this._store.select(s => s.vehicleTechRecordModel.initialDetails.error);
  }

  ngOnInit() {
    this.createTechRecordForm = new FormGroup({
      'vehicleType': new FormControl('', Validators.required),
      'vin': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(21)]),
      'vrm': new FormControl('', Validators.required)
    });

    this.formError$.subscribe( result => {
      this.formErrors.requestErr = result;
      this.hasVinReqErrors = result.includes('A technical record with this VIN already exists, check the VIN or change the existing technical record');
      this.hasVrmReqErrors = result.includes('A technical record with this VRM already exists, check the VRM or change the existing technical record');
    });
  }

  setVrmValidators($event): void {
    const vrmControl = this.createTechRecordForm.get('vrm');

    if ($event.currentTarget.id === 'test-radio-PSV' || $event.currentTarget.id === 'test-radio-HGV') {
      this.vrmLabel = 'Vehicle registration mark (VRM)';
      vrmControl.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(8)]);
    } else {
      this.vrmLabel = 'Vehicle registration mark (VRM - optional)';
      vrmControl.setValidators([Validators.minLength(1), Validators.maxLength(8)]);
    }
    vrmControl.updateValueAndValidity();
  }

  onSubmit() {
    
    this.formErrors.vinErr   = !this.createTechRecordForm.get('vin').valid ? 'Enter a VIN' : '';
    this.formErrors.vrmErr   = !this.createTechRecordForm.get('vrm').valid ? 'Enter a VRM' : '';
    this.formErrors.vTypeErr = !this.createTechRecordForm.get('vehicleType').valid ? 'Select a vehicle type' : '';
    this.hasErrors = !Object.values(this.formErrors).every(val => val === '');

    const createDetails: CreateTechRecordVM = {
      vin: this.createTechRecordForm.get('vin').value,
      vrm: this.createTechRecordForm.get('vrm').value,
      vType: this.createTechRecordForm.get('vehicleType').value,
      error: ['']
    };

    if (!this.formErrors.vinErr && !this.formErrors.vrmErr && !this.formErrors.vTypeErr) {
      this._store.dispatch(new SetVehicleTechRecordModelVinOnCreate(createDetails));
    }

    setTimeout(function() {
      document.getElementById('test-vin').focus();
      document.getElementById('test-vrm').focus();
    }, 1000);
  }

}
