import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { GlobalWarningComponent } from './components/global-warning/global-warning.component';
import { HeaderComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
	declarations: [
		FooterComponent,
		HeaderComponent,
		GlobalErrorComponent,
		GlobalWarningComponent,
		SpinnerComponent,
		BreadcrumbsComponent,
		PageNotFoundComponent,
		ServerErrorComponent,
		PhaseBannerComponent,
	],
	imports: [CommonModule, RouterModule],
	exports: [
		FooterComponent,
		HeaderComponent,
		GlobalErrorComponent,
		GlobalWarningComponent,
		SpinnerComponent,
		BreadcrumbsComponent,
		PhaseBannerComponent,
	],
})
export class CoreModule {}
