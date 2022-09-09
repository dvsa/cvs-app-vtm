import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-incorrect-test-type',
  templateUrl: './incorrect-test-type.component.html'
})
export class IncorrectTestTypeComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  handleTestTypeSelection(testType: string) {
    this.router.navigate(['amend-test-details'], { queryParams: { testType }, queryParamsHandling: 'merge', relativeTo: this.route });
  }
}
