import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShellPage} from './shell.page';
import {SharedModule} from '@app/shared/shared.module';
import {HeaderComponent} from '@app/shell/header/header.component';
import {FooterComponent} from '@app/shell/footer/footer.component';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {RouterModule} from '@angular/router';
import {TechnicalRecordSearchComponent} from '@app/technical-record-search/technical-record-search.component';
import {TechnicalRecordSearchModule} from '@app/technical-record-search/technical-record-search.module';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';
import { TechnicalRecordModule } from '@app/technical-record/technical-record.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheckSquare, faCoffee, faPlus, faMinus, faSquare} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare as farCheckSquare, faSquare as farSquare} from '@fortawesome/free-regular-svg-icons';
import {faGithub, faMedium, faStackOverflow} from '@fortawesome/free-brands-svg-icons';

export const COMPONENTS = [
  ShellPage,
  HeaderComponent,
  FooterComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '', component: ShellPage, canActivate: [AuthenticationGuard],
        children: [
          {path: '', redirectTo: 'search', pathMatch: 'full'},
          {
            path: 'search',
            component: TechnicalRecordSearchComponent,
            // tslint:disable-next-line:max-line-length
            loadChildren: '../technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
            canActivate: [AuthenticationGuard]
          },
          {
            path: 'technical-record',
            component: TechnicalRecordComponent,
            // tslint:disable-next-line:max-line-length
            loadChildren: '../technical-record/technical-record.module#TechnicalRecordModule',
            canActivate: [AuthenticationGuard]
          }
        ]
      }
    ]),
    TechnicalRecordSearchModule,
    TechnicalRecordModule,
    FontAwesomeModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ShellPage],
})
export class ShellPageModule {
  constructor() {
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faPlus, faMinus);
  }
}
