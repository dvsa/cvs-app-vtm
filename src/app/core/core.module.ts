import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, GlobalErrorComponent, SpinnerComponent, BreadcrumbsComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, HeaderComponent, GlobalErrorComponent, SpinnerComponent, BreadcrumbsComponent]
})
export class CoreModule {}
