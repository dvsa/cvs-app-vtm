import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordCreateRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateTechRecordComponent } from './create-tech-record.component';

const routes: Routes = [
	{
		path: '',
		resolve: { data: techRecordDataResolver },
		canActivate: [MsalGuard, RoleGuard],
		children: [
			{
				path: '',
				component: CreateTechRecordComponent,
				data: { roles: Roles.TechRecordCreate },
			},
			{
				path: TechRecordCreateRoutes.NEW_RECORD_DETAILS,
				children: [
					{
						path: '',
						component: HydrateNewVehicleRecordComponent,
						data: {
							title: 'New record details',
							roles: Roles.TechRecordCreate,
							isCustomLayout: true,
							isEditing: true,
						},
					},
					{
						path: TechRecordCreateRoutes.TYRE_SEARCH,
						component: TechRecordSearchTyresComponent,
						data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
					},
				],
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CreateTechRecordsRoutingModule {}
