import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import cloneDeep from 'lodash.clonedeep';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BatchTechnicalRecordService } from './batch-technical-record.service';
import { SearchResult } from '@store/tech-record-search/reducer/tech-record-search.reducer';

describe('TechnicalRecordService', () => {
  let service: BatchTechnicalRecordService;
  let httpClient: HttpTestingController;
  let technicalRecordHttpService: TechnicalRecordHttpService;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        BatchTechnicalRecordService,
        provideMockStore({ initialState: initialAppState }),
        TechnicalRecordHttpService,
        TechnicalRecordService
      ]
    });
    httpClient = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BatchTechnicalRecordService);
    technicalRecordHttpService = TestBed.inject(TechnicalRecordHttpService);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpClient.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateForBatch', () => {
    let testGroup: FormGroup;
    beforeEach(() => {
      testGroup = new FormGroup({
        vin: new CustomFormControl({ name: 'vin', type: FormNodeTypes.CONTROL }, null, null),
        trailerId: new FormControl({ name: 'trailerId', value: '' }, null),
        systemNumber: new FormControl({ name: 'systemNumber', value: '' }, null)
      });
    });

    it('return null if vin and trailer id are not provided', done => {
      expect.assertions(1);
      testGroup.get('vin')!.setValue(null);
      testGroup.get('trailerId')!.setValue(null);
      const serviceCall = service.validateForBatch()(testGroup.get('vin')!);
      (serviceCall as Observable<ValidationErrors | null>).subscribe(errors => {
        expect(errors).toEqual(null);
        done();
      });
    });

    it('return null if the required controls do not exist', done => {
      expect.assertions(1);
      testGroup = new FormGroup({ vin: new FormControl({ name: 'vin' }) });
      const serviceCall = service.validateForBatch()(testGroup.get('vin')!);
      (serviceCall as Observable<ValidationErrors | null>).subscribe(errors => {
        expect(errors).toEqual(null);
        done();
      });
    });

    it('throws an error if trailer id is provided but vin is not', done => {
      expect.assertions(1);
      testGroup.get('trailerId')!.setValue('test');

      const serviceCall = service.validateForBatch()(testGroup.get('vin')!);
      (serviceCall as Observable<ValidationErrors | null>).subscribe(errors => {
        expect(errors).toEqual({ validateForBatch: { message: 'VIN is required' } });
        done();
      });
    });

    describe('when only vin is provided', () => {
      it('should return null when it is a unique vin', async () => {
        testGroup.get('trailerId')!.setValue('');
        testGroup.get('vin')!.setValue('TESTVIN');

        const isUniqueSpy = jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));

        const serviceCall = service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>;
        const errors = await firstValueFrom(serviceCall);
        expect(isUniqueSpy).toHaveBeenCalled();
        expect(errors).toBeNull();
      });

      it('should set a warning when it is not a unique vin', async () => {
        testGroup.get('trailerId')!.setValue('');
        const vinControl = testGroup.get('vin') as CustomFormControl;
        vinControl.setValue('TESTVIN');
        jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(false));
        await firstValueFrom(service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>);
        expect(vinControl.meta.warning).toEqual('This VIN already exists, if you continue it will be associated with two vehicles');
      });
    });

    describe('when both vin and trailer id are provided', () => {
      it('returns null if only 1 vehicle exists with those values with no current tech record', async () => {
        expect.assertions(1);
        testGroup.get('vin')!.setValue('TESTVIN');
        testGroup.get('trailerId')!.setValue('TESTTRAILERID');
        const mockSearchResult = {
          vin: 'TESTVIN',
          trailerId: 'TESTTRAILERID',
          systemNumber: 'TESTSYSTEMNUMBER'
        } as SearchResult;

        jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult]));

        const serviceCall = service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>;
        const errors = await firstValueFrom(serviceCall);
        expect(errors).toBeNull();
      });

      it('returns null if only 1 vehicle exists with those values with a current tech record', async () => {
        expect.assertions(1);
        testGroup.get('vin')!.setValue('TESTVIN');
        testGroup.get('trailerId')!.setValue('TESTTRAILERID');
        const mockSearchResult = {
          vin: 'TESTVIN',
          trailerId: 'TESTTRAILERID',
          systemNumber: 'TESTSYSTEMNUMBER',
          techRecord_statusCode: StatusCodes.CURRENT
        } as SearchResult;

        jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult]));

        const serviceCall = service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>;
        const errors = await firstValueFrom(serviceCall);
        expect(errors).toEqual({ validateForBatch: { message: 'This record cannot be updated as it has a Current tech record' } });
      });

      it('throws an error if more than 1 vehicle exists with those values', async () => {
        expect.assertions(1);
        testGroup.get('vin')!.setValue('TESTVIN');
        testGroup.get('trailerId')!.setValue('TESTTRAILERID');
        const mockSearchResult = { vin: 'TESTVIN', trailerId: 'TESTTRAILERID' } as SearchResult;

        jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult, { ...mockSearchResult, systemNumber: 'foobar' }]));

        const errors = await firstValueFrom(service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>);
        expect(errors).toEqual({ validateForBatch: { message: 'More than one vehicle has this VIN and Trailer ID' } });
      });
    });

    it('throws an error if no vehicle exists with those values', async () => {
      expect.assertions(1);
      testGroup.get('vin')!.setValue('TESTVIN');
      testGroup.get('trailerId')!.setValue('TESTTRAILERID');

      jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([]));

      const errors = await firstValueFrom(service.validateForBatch()(testGroup.get('vin')!) as Observable<ValidationErrors | null>);
      expect(errors).toEqual({ validateForBatch: { message: 'Could not find a record with matching VIN and Trailer ID' } });
    });
  });
});
