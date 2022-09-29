export enum Roles {
  Admin = 'CVSFullAccess',
  TechRecordView = 'CVSFullAccess,TechRecord.View',
  TechRecordCreate = 'CVSFullAccess,TechRecord.Create',
  TechRecordAmend = 'CVSFullAccess,TechRecord.Amend',
  TestResultView = 'CVSFullAccess,TestResult.View',
  TestResultAmend = 'CVSFullAccess,TestResult.Amend'
}
