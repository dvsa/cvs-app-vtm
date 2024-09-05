import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordCreateBatchRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { RouterOutletComponent } from '../../../components/router-outlet/router-outlet.component';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
import { BatchVehicleDetailsComponent } from './components/batch-vehicle-details/batch-vehicle-details.component';
import { BatchVehicleResultsComponent } from './components/batch-vehicle-results/batch-vehicle-results.component';
import { BatchVehicleTemplateComponent } from './components/batch-vehicle-template/batch-vehicle-template.component';
import { SelectVehicleTypeComponent } from './components/select-vehicle-type/select-vehicle-type.component';

const routes: Routes = [
	{
		path: '',
		component: RouterOutletComponent,
		data: { roles: Roles.TechRecordCreate },
		canActivate: [MsalGuard, RoleGuard],
		resolve: {
			data: techRecordDataResolver,
		},
		children: [
			{
				path: '',
				component: SelectVehicleTypeComponent,
				data: { roles: Roles.TechRecordCreate },
				canActivate: [MsalGuard, RoleGuard],
			},
			{
				path: TechRecordCreateBatchRoutes.RECORD,
				component: RouterOutletComponent,
				data: { title: 'Batch Record', roles: Roles.TechRecordCreate, isCustomLayout: true },
				children: [
					{
						path: '',
						component: BatchVehicleTemplateComponent,
						data: {
							title: 'Batch Record',
							roles: Roles.TechRecordCreate,
							isCustomLayout: true,
							isEditing: true,
						},
					},
					{
						path: TechRecordCreateBatchRoutes.DETAILS,
						component: BatchVehicleDetailsComponent,
						data: { title: 'Add batch of vehicles', roles: Roles.TechRecordCreate, isEditing: true },
					},
					{
						path: TechRecordCreateBatchRoutes.BATCH_RESULT,
						data: { title: 'Batch summary' },
						component: BatchVehicleResultsComponent,
					},
					{
						path: TechRecordCreateBatchRoutes.TYRE_SEARCH,
						component: TechRecordSearchTyresComponent,
						data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
						canActivate: [MsalGuard, RoleGuard],
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
export class CreateBatchRoutingModule {}
