export enum Roles {
  Admin = 'CVSFullAccess',
  TechRecordView = 'CVSFullAccess,TechRecord.View',
  TechRecordCreate = 'CVSFullAccess,TechRecord.Create',
  TechRecordAmend = 'CVSFullAccess,TechRecord.Amend',
  TechRecordArchive = 'CVSFullAccess,TechRecord.Archive',
  TechRecordUnarchive = 'CVSFullAccess,TechRecord.Unarchive',
  TestResultView = 'CVSFullAccess,TestResult.View',
  TestResultAmend = 'CVSFullAccess,TestResult.Amend',
  TestResultCreateContingency = 'CVSFullAccess,TestResult.CreateContingency',
  TestResultCreateDeskAssessment = 'CVSFullAccess,TestResult.CreateDeskBased',
  ReferenceDataView = 'CVSFullAccess,ReferenceData.View',
  ReferenceDataAmend = 'CVSFullAccess,ReferenceData.Amend'
}
