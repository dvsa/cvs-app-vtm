import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../components/components.module';
import { WebComponentsModule } from '../web-components/web-components.module';

import { ShellPage } from './shell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShellPage
      }
    ]),
    ComponentsModule,
    WebComponentsModule
  ],
  declarations: [ShellPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShellPageModule {}
