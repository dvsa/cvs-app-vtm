import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import * as FileSaver from 'file-saver';

import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { AdrComponent } from '../adr.component';
import { UUID_REGEX } from '../adr.constants';
import { ValidationMapper, ValidationState, STATUS } from '../adr-validation.mapper';
import { DocumentMetaData, DocumentInfo } from '@app/models/document-meta-data';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-tank-documents',
  templateUrl: './tank-documents.component.html',
  styleUrls: ['./tank-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDocumentsComponent extends AdrComponent implements OnChanges, OnInit {
  adrForm: FormGroup;
  showTankDocuments = true;
  documentNames: string[];
  documentValidationState$: Observable<ValidationState>;

  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  get documents() {
    return this.adrForm.get('documents') as FormArray;
  }

  constructor(
    protected fdg: FormGroupDirective,
    protected fb: FormBuilder,
    protected vm: ValidationMapper,
    protected ref: ChangeDetectorRef,
    private techRecordService: TechnicalRecordService
  ) {
    super(fdg, fb, vm, ref);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.edit) {
      const { vehicleDetails, documents } = this.adrDetails;
      this.documentValidationState$ = this.validationMapper.getCurrentState();

      const vehicleType = vehicleDetails && vehicleDetails.type ? vehicleDetails.type : '';
      const documentNames = documents && documents.length ? documents : ([] as string[]);

      this.adrForm = super.setUp();

      this.adrForm.addControl('documents', this.processDocumentList(documentNames));

      if (changes.edit.currentValue && vehicleType) {
        this.validationMapper.vehicleTypeSelected(vehicleType);
      } else {
        this.showTankDocuments = true;
      }
    }
  }

  ngOnInit() {
    this.handleFormChanges();
  }

  processDocumentList(listMetaNames: string[]): FormArray {
    return this.fb.array(
      listMetaNames
        .map<FormGroup>(this.buildDocumentMetaDataGroup.bind(this))
        .filter((group) => Object.keys(group.controls).length > 0)
    );
  }

  buildDocumentMetaDataGroup(metaName: string): FormGroup {
    return this.fb.group(this.mapToDocumentMetaData(metaName));
  }

  mapToDocumentMetaData(mapMetaName: string): DocumentMetaData {
    const nameStr = mapMetaName.trim();

    const validUUID = nameStr.match(UUID_REGEX);
    if (!validUUID) {
      return {} as DocumentMetaData;
    }

    return {
      uuid: validUUID[0],
      fileName: nameStr.split(UUID_REGEX)[1].replace('_', ''),
      metaName: nameStr
    } as DocumentMetaData;
  }

  async uploadSelectedFile($event) {
    const selectedFile: File =
      $event.target.files && $event.target.files.length ? $event.target.files[0] : undefined;

    const metaName = `${this.getUUID()}_${selectedFile.name}`;
    const docuInfo: DocumentInfo = {
      metaName: metaName,
      file: selectedFile
    } as DocumentInfo;

    const uploaded = await this.techRecordService.uploadDocument(docuInfo);
    if (uploaded) {
      this.ref.markForCheck();
      this.addDocumentMetaDataGroup(metaName);
    }
  }

  addDocumentMetaDataGroup(addMetaName: string): void {
    this.documents.push(this.buildDocumentMetaDataGroup(addMetaName));
  }

  async downloadDocument(documentMetaData: DocumentMetaData) {
    const documentBlob = await this.techRecordService.downloadDocument(documentMetaData);

    if (documentBlob) {
      FileSaver.saveAs(documentBlob, documentMetaData.fileName);
    }
  }

  removeDocument(position: number): void {
    this.documents.removeAt(position);
  }

  getUUID() {
    return uuidV4();
  }

  handleFormChanges() {
    this.documentValidationState$
      .pipe(
        tap(({ tankDocuments }) => {
          if (tankDocuments === STATUS.HIDDEN) {
            this.showTankDocuments = false;
            this.removeAllDocuments();
          } else {
            this.showTankDocuments = true;
          }

          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  removeAllDocuments(): void {
    let index = this.documents.controls.length - 1;
    for (; index >= 0; index--) {
      this.removeDocument(index);
    }
  }
}
