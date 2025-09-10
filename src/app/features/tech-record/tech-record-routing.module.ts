import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { CancelEditTechGuard } from '@guards/cancel-edit-tech/cancel-edit-tech.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordRoutes } from '@models/routes.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { techRecordCleanResolver } from 'src/app/resolvers/tech-record-clean/tech-record-clean.resolver';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { techRecordValidateResolver } from 'src/app/resolvers/tech-record-validate/tech-record-validate.resolver';
import { techRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';

const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./tech-record.component').then((m) => m.TechRecordComponent),
		data: { roles: Roles.TechRecordView, isCustomLayout: true },
		canActivateChild: [MsalGuard, RoleGuard],
		canActivate: [CancelEditTechGuard],
		resolve: {
			load: techRecordViewResolver,
			data: techRecordDataResolver,
		},
	},
	{
		path: TechRecordRoutes.CORRECT_ERROR,
		loadComponent: () => import('./tech-record.component').then((m) => m.TechRecordComponent),
		data: {
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.CORRECTING_AN_ERROR,
			isCustomLayout: true,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: {
			techRecord: techRecordViewResolver,
			load: techRecordValidateResolver,
			clean: techRecordCleanResolver,
		},
	},
	{
		path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED,
		loadComponent: () => import('./tech-record.component').then((m) => m.TechRecordComponent),
		data: {
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
			isCustomLayout: true,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: {
			techRecord: techRecordViewResolver,
			load: techRecordValidateResolver,
			clean: techRecordCleanResolver,
		},
	},

	{
		path: TechRecordRoutes.CHANGE_VIN,
		loadComponent: () =>
			import('./components/tech-record-amend-vin/tech-record-amend-vin.component').then((m) => m.AmendVinComponent),
		data: { title: 'Change VIN', roles: Roles.TechRecordAmend },
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.CHANGE_VRM,
		loadComponent: () =>
			import('./components/tech-record-amend-vrm-reason/tech-record-amend-vrm-reason.component').then(
				(m) => m.AmendVrmReasonComponent
			),
		data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.REASON_TO_CHANGE_VRM,
		loadComponent: () =>
			import('./components/tech-record-amend-vrm/tech-record-amend-vrm.component').then((m) => m.AmendVrmComponent),
		data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.GENERATE_PLATE,
		loadComponent: () =>
			import('./components/tech-record-generate-plate/tech-record-generate-plate.component').then(
				(m) => m.GeneratePlateComponent
			),
		data: { title: 'Generate plate', roles: Roles.TechRecordAmend },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { load: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.GENERATE_LETTER,
		loadComponent: () =>
			import('./components/tech-record-generate-letter/tech-record-generate-letter.component').then(
				(m) => m.GenerateLetterComponent
			),
		data: { title: 'Generate letter', roles: Roles.TechRecordAmend },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { load: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.AMEND_REASON,
		loadComponent: () =>
			import('./components/tech-record-amend-reason/tech-record-amend-reason.component').then(
				(m) => m.TechRecordAmendReasonComponent
			),
		data: { roles: Roles.TechRecordAmend },
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.CHANGE_STATUS,
		loadComponent: () =>
			import('./components/tech-record-change-status/tech-record-change-status.component').then(
				(m) => m.TechRecordChangeStatusComponent
			),
		data: { title: 'Promote or Archive Tech Record', roles: Roles.TechRecordArchive },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { load: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.UNARCHIVE_RECORD,
		loadComponent: () =>
			import('./components/tech-record-unarchive/tech-record-unarchive-component').then(
				(m) => m.TechRecordUnarchiveComponent
			),
		data: { title: 'Unarchive Record', roles: Roles.TechRecordUnarchive },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { load: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.CHANGE_VEHICLE_TYPE,
		loadComponent: () =>
			import('./components/tech-record-change-type/tech-record-change-type.component').then(
				(m) => m.ChangeVehicleTypeComponent
			),
		data: { title: 'Change vehicle type', roles: Roles.TechRecordAmend, isEditing: true },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.CHANGE_VTA_VISIBILITY,
		loadComponent: () =>
			import('./components/tech-record-change-visibility/tech-record-change-visibility.component').then(
				(m) => m.TechRecordChangeVisibilityComponent
			),
		data: { roles: Roles.TechRecordAmend },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.CORRECT_ERROR_TYRE_SEARCH,
		loadComponent: () =>
			import('./components/tech-record-search-tyres/tech-record-search-tyres.component').then(
				(m) => m.TechRecordSearchTyresComponent
			),
		data: {
			title: 'Tyre search',
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.CORRECTING_AN_ERROR,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.CORRECT_ERROR_CHANGE_SUMMARY,
		loadComponent: () =>
			import('./components/tech-record-summary-changes-wrapper/tech-record-summary-changes-wrapper.component').then(
				(m) => m.TechRecordSummaryChangesWrapperComponent
			),
		data: {
			roles: Roles.TechRecordAmend,
			isEditing: true,
		},
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.CORRECT_ERROR_EDIT_ADDITIONAL_EXAMINER_NOTE,
		loadComponent: () =>
			import(
				'./components/tech-record-edit-additional-examiner-note/tech-record-edit-additional-examiner-note.component'
			).then((m) => m.TechRecordEditAdditionalExaminerNoteComponent),
		data: {
			title: 'Edit Additional Examiner Note',
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.CORRECTING_AN_ERROR,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED_CHANGE_SUMMARY,
		loadComponent: () =>
			import('./components/tech-record-summary-changes-wrapper/tech-record-summary-changes-wrapper.component').then(
				(m) => m.TechRecordSummaryChangesWrapperComponent
			),
		data: {
			roles: Roles.TechRecordAmend,
			isEditing: true,
		},
		canActivate: [MsalGuard, RoleGuard],
	},
	{
		path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED_TYRE_SEARCH,
		loadComponent: () =>
			import('./components/tech-record-search-tyres/tech-record-search-tyres.component').then(
				(m) => m.TechRecordSearchTyresComponent
			),
		data: {
			title: 'Tyre search',
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.NOTIFIABLE_ALTERNATION_NEEDED_EDIT_ADDITIONAL_EXAMINER_NOTE,
		loadComponent: () =>
			import(
				'./components/tech-record-edit-additional-examiner-note/tech-record-edit-additional-examiner-note.component'
			).then((m) => m.TechRecordEditAdditionalExaminerNoteComponent),
		data: {
			title: 'Edit Additional Examiner Note',
			roles: Roles.TechRecordAmend,
			isEditing: true,
			reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
		},
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
	},
	{
		path: TechRecordRoutes.TEST_RECORDS,
		data: { title: 'Test record', roles: Roles.TestResultView },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
		loadChildren: () => import('../test-records/amend/amend-test-records.module').then((m) => m.AmendTestRecordsModule),
	},
	{
		path: TechRecordRoutes.CREATE_TEST,
		data: { title: 'Create Contingency test', roles: Roles.TestResultCreateContingency },
		canActivate: [MsalGuard, RoleGuard],
		resolve: { techRecord: techRecordViewResolver },
		loadChildren: () =>
			import('../test-records/create/create-test-records.module').then((m) => m.CreateTestRecordsModule),
	},
	{
		path: TechRecordRoutes.ADR_CERTIFICATE,
		loadComponent: () =>
			import('./components/adr-generate-certificate/adr-generate-certificate.component').then(
				(m) => m.AdrGenerateCertificateComponent
			),
		data: { title: 'Generate ADR Certificate', roles: Roles.TestResultCreateDeskAssessment },
		canActivate: [MsalGuard, RoleGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TechRecordsRoutingModule {}
