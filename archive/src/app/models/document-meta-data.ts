export interface DocumentMetaData {
  uuid: string;
  fileName: string;
  metaName: string;
}

export interface DocumentInfo {
  metaName: string;
  file?: File;
}
