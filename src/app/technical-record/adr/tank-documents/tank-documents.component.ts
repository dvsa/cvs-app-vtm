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
import { v4 as uuidV4 } from 'uuid';
import * as FileSaver from 'file-saver';

import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { DocumentMetaData, DocumentInfo } from '@app/models/document-meta-data';
import { AdrComponent } from '../adr.component';
import { UUID_REGEX } from '../adr.constants';
import { ValidationMapper } from '../adr-validation.mapper';

@Component({
  selector: 'vtm-tank-documents',
  templateUrl: './tank-documents.component.html',
  styleUrls: ['./tank-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDocumentsComponent extends AdrComponent implements OnChanges, OnInit {
  adrForm: FormGroup;

  @Input() edit: boolean;
  @Input() documentNames: string[];

  get documents() {
    return this.adrForm.get('documents') as FormArray;
  }

  constructor(
    protected fdg: FormGroupDirective,
    protected fb: FormBuilder,
    protected vm: ValidationMapper,
    private ref: ChangeDetectorRef,
    private techRecordService: TechnicalRecordService
  ) {
    super(fdg, fb, vm);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.edit) {
      this.adrForm = super.setUp();

      const docList =
        this.documentNames && this.documentNames.length ? this.documentNames : ([] as string[]);

      this.adrForm.addControl('documents', this.processDocumentList(docList));
    }
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
    const docuInfo: DocumentInfo = { metaName: documentMetaData.metaName };
    const documentBlob = await this.techRecordService.downloadDocument(docuInfo);

    FileSaver.saveAs(documentBlob, documentMetaData.fileName);
  }

  removeDocument(position: number): void {
    this.documents.removeAt(position);
  }

  getUUID() {
    return uuidV4();
  }
}
