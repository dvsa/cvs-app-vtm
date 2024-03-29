import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { GlobalWarningComponent } from './components/global-warning/global-warning.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';

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
