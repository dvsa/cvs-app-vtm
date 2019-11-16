import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ComponentsModule} from '../components/components.module';
import {WebComponentsModule} from '../web-components/web-components.module';

import {ShellPage} from './shell.page';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {TechnicalRecordSearchComponent} from '@app/components/technical-record-search/technical-record-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {path: '', component: ShellPage, canActivate: [AuthenticationGuard],
        children: [
          { path: '', redirectTo: 'search', pathMatch: 'full' },
          {
            path: 'search', component: TechnicalRecordSearchComponent,
            loadChildren: '../components/components.module#ComponentsModule', canActivate: [AuthenticationGuard]
          }
        ]
      }
    ]),
    ComponentsModule,
    WebComponentsModule
  ],
  declarations: [ShellPage],
  exports: [
    ShellPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShellPageModule {
}
