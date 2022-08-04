export enum Roles {
  NonProdAdmin = 'CVSFullAccess',
  TechRecordView = 'CVSFullAccess,TechRecord.View',
  TechRecordCreate = 'CVSFullAccess,TechRecord.Create',
  TestRecordView = 'CVSFullAccess,TestResult.View',
  TestRecordUpdate = 'CVSFullAccess,TestResult.Update',
}
