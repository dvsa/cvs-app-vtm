import { Component, input } from '@angular/core';

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
})
export class BannerComponent {
	type = input<'information' | 'success'>('information');
}
