import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html'
})
export class AddReferenceDataComponent implements OnInit {
  constructor(public globalErrorService: GlobalErrorService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  // handleSubmit(): void {
  //     this.router.navigate(['../reference-data/data-type-list'], { relativeTo: this.route });

  // }

  get roles() {
    return Roles;
  }

  back() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
