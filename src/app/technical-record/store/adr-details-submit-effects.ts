import { Injectable } from '@angular/core';
import { Actions, Effect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { tap, exhaustMap, switchMap, map, catchError, withLatestFrom, take } from 'rxjs/operators';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { SubmitAdrAction, SubmitAdrActionFailure, SubmitAdrActionSuccess } from './adrDetailsSubmit.actions';
import { GetVehicleTechRecordModelHavingStatusAllSuccess } from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '@app/store/actions/VehicleTestResultModel.actions';
import { IAppState } from '@app/store/state/app.state';
import { SetValueAction, ResetAction } from 'ngrx-forms';
import { INITIAL_STATE } from '@app/technical-record/adr-details-form/store/adrDetailsForm.state';
import { IAppState as IAdrState } from '@app/technical-record/adr-details-form/store/adrDetailsForm.state'
import { FilterRecordPipe } from '@app/pipes/FilterRecordPipe';

@Injectable()
export class AdrDetailsSubmitEffects implements OnRunEffects {
  @Effect()
  adrSubmit$ = this._actions$.pipe(
    ofType<SubmitAdrAction>(SubmitAdrAction.TYPE),
    withLatestFrom(this._store$.select(selectVehicleTechRecordModelHavingStatusAll)
      .pipe(
        map(s => {
          return {
            vin: s.vin,
            activeRecord: this._filterRecordPipe.transform(s.techRecord)
          };
        }),
      )),
    switchMap(([action, payload]) => {
      return this._store$.select((s: IAdrState) => s.adrDetails.formState).pipe(
        take(1),
        tap((_) => {
          console.log(`payload of this._store$.select((s: IAdrState) => ) => ${JSON.stringify(_)}`)
        }),
        map(fs => this.createSubmitState(fs.value, payload.activeRecord)),
      ).pipe(
        switchMap((submitValue) => this._technicalRecordService.updateTechnicalRecords(submitValue, payload.vin)
          .pipe(
            switchMap((searchIdentifier: string) => this._technicalRecordService.getTechnicalRecordsAllStatuses(payload.vin)
              .pipe(
                switchMap((techRecordJson: any) => of(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordJson))),
                tap((_) => {
                  this._store$.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
                  this._store$.dispatch(new ResetAction(INITIAL_STATE.id));
                  this._store$.dispatch(new SubmitAdrActionSuccess({}));
                  this._store$.dispatch(new GetVehicleTestResultModel(payload.vin));
                  this._router$.navigate([`/technical-record`]);
                })
              )),
            catchError((error) =>
              of(new SubmitAdrActionFailure(error))
            ))));
    })
  );

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this._actions$.pipe(
      exhaustMap((res) => {
        return resolvedEffects$;
      })
    );
  }

  constructor(
    private _actions$: Actions,
    private _technicalRecordService: TechnicalRecordService,
    private _store$: Store<IAppState>,
    private _router$: Router,
    private _filterRecordPipe: FilterRecordPipe
  ) { }

  private createSubmitState = (adrDetails: any, techRecord: any) => {
    const techRecordDTO: any = {};
    techRecord.files = [];
    techRecordDTO.msUserDetails = {'msUser': 'catalin' , 'msOid': '123243424-234234245'};
    techRecordDTO.techRecord = [];
    techRecord.reasonForCreation = 'Update ADR TYPE';
    techRecord.adrDetails = {
        vehicleDetails: {
          type: adrDetails.type,
          approvalDate: adrDetails.approvalDate.year + '-' + adrDetails.approvalDate.month + '-' + adrDetails.approvalDate.day
        },
        listStatementApplicable: adrDetails.listStatementApplicable === 'applicable',
        batteryListNumber: adrDetails.batteryListNumber,
        declarationSeen: adrDetails.declarationsSeen === 'true', // boolean
        brakeDeclarationsSeen: adrDetails.brakeDeclarationsSeen,
        brakeDeclarationIssuer: adrDetails.brakeDeclarationIssuer,
        brakeEndurance: adrDetails.brakeEndurance, // boolean
        weight: adrDetails.weight,
        compatibilityGroupJ: adrDetails.compatibilityGroupJ,
        permittedDangerousGoods: [
          adrDetails.permittedDangerousGoods
        ],
        additionalExaminerNotes: adrDetails.additionalNotes,
        applicantDetails: {
          name: adrDetails.name,
          street: adrDetails.street,
          town: adrDetails.town,
          city: adrDetails.city,
          postcode: adrDetails.postcode
        },
        memosApply: [
          adrDetails.memosApply
        ],
        additionalNotes: {
          guidanceNotes: [
            adrDetails.guidanceNotes
          ]
        },
        adrTypeApprovalNo: adrDetails.adrTypeApprovalNo,
        tank: {
          tankDetails: {
            tankManufacturer: adrDetails.tankManufacturer,
            yearOfManufacture: adrDetails.yearOfManufacture,
            tankCode: adrDetails.tankCode,
            specialProvisions: adrDetails.specialProvisions,
            tankManufacturerSerialNo: adrDetails.tankManufacturerSerialNo,
            tankTypeAppNo: adrDetails.tankTypeAppNo,
            tc2Details: {
              tc2Type: adrDetails.tc2Type,
              tc2IntermediateApprovalNo: adrDetails.tc2IntermediateApprovalNo,
              // tslint:disable-next-line:max-line-length
              tc2IntermediateExpiryDate: adrDetails.tc2IntermediateExpiryDate.year + '-' + adrDetails.tc2IntermediateExpiryDate.month + '-' + adrDetails.tc2IntermediateExpiryDate.day
            },
            tc3Details: [
              {
                tc3Type: adrDetails.tc3Type,
                tc3PeriodicNumber: adrDetails.tc3PeriodicNumber,
                // tslint:disable-next-line:max-line-length
                tc3PeriodicExpiryDate: adrDetails.tc3PeriodicExpiryDate.year + '-' + adrDetails.tc3PeriodicExpiryDate.month + '-' + adrDetails.tc3PeriodicExpiryDate.day
              }
            ]

          },
          tankStatement: {
            substancesPermitted: adrDetails.substancesPermitted,
            statement: adrDetails.statement,
            productListRefNo: adrDetails.productListRefNo,
            productListUnNo: adrDetails.productListUnNo,
            productList: adrDetails.productList
          }
        }
      };

      techRecordDTO.techRecord.push(techRecord);
      return techRecordDTO;
  }
}
