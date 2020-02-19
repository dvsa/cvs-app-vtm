import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentMetaData } from './document-meta-data';

@Component({
  selector: 'vtm-tank-documents',
  templateUrl: './tank-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankDocumentsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() documents: string[];

  documentListMetaData: DocumentMetaData[] = [];

  constructor() {}

  ngOnInit() {
    // TODO: To be removed
    this.documents = [
      'cf73207f-3ced-488a-82a0-3fba79c2ce85_excelFileName',
      'df73207f-3ced-488a-82a0-3fba79c2ce86_TryeFileName'
    ];
    this.processDocumentList(this.documents);
  }

  processDocumentList(documents: string[]) {
    documents.forEach((document) => {
      const arrData = document.trim().split('_');
      this.documentListMetaData.push({
        uuid: arrData[0],
        fileName: arrData[1]
      });
    });
  }

  downloadDocument(documentMetaData: DocumentMetaData) {
    console.log('action to download document from S3');
    console.log(documentMetaData);
  }
}
