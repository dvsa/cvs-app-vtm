export enum Roles {
  Admin = 'CVSFullAccess',
  TechRecordView = 'CVSFullAccess,TechRecord.View',
  TechRecordCreate = 'CVSFullAccess,TechRecord.Create',
  TechRecordAmend = 'CVSFullAccess,TechRecord.Amend',
  TechRecordArchive = 'CVSFullAccess,TechRecord.Archive',
  TestResultView = 'CVSFullAccess,TestResult.View',
  TestResultAmend = 'CVSFullAccess,TestResult.Amend',
  TestResultCreateContingency = 'CVSFullAccess,TestResult.CreateContingency'
}
