import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'vtm-tech-rec-history',
  templateUrl: './tech-rec-history.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecHistoryComponent implements OnInit {

  @Input() techRecordsJson: any;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  switchTechRecord(techRecNumber): void {

    const elems = document.querySelectorAll('.t-history a');

    Array.prototype.slice.call(elems).forEach(function(value) {
        value.hidden = (value.id === 'tech-rec-' + techRecNumber);
    });

    this.router.navigate(['/technical-record', { id: techRecNumber }]);
  }


}
