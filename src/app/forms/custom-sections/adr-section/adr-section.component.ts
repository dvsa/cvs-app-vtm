import { Component, input } from '@angular/core';

@Component({
  selector: 'app-adr-section',
  templateUrl: './adr-section.component.html',
  styleUrls: ['./adr-section.component.scss'],
})
export class AdrSectionComponent {
  mode = input<Mode>('edit');
}

type Mode = 'view' | 'edit' | 'summary';
