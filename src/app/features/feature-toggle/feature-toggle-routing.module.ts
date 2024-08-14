import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { FeatureToggleGuard } from '@guards/feature-toggle-guard/feature-toggle.guard';
import { FeatureToggleComponent } from './feature-toggle/feature-toggle.component';

const routes = [
	{
		path: '',
		component: FeatureToggleComponent,
		data: { title: 'Feature Toggle', featureToggleName: 'testToggle' },
		canActivate: [MsalGuard, FeatureToggleGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FeatureToggleRoutingModule {}
