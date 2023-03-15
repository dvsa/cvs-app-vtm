import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { BatchCreateComponent } from './batch-create.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { tile: 'Batch Creation', roles: Roles.TechRecordCreate },
    children: [
      {
        path: '',
        data: { tile: 'Batch Creation', roles: Roles.TechRecordCreate },
        component: BatchCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchCreateRoutingModule {}
