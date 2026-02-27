import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import packageInfo from '../../../../../package.json';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
	readonly logOutEvent = output<void>();
	readonly username = input<string | null>('');
	protected readonly version = packageInfo.version;

	router = inject(Router);
	featureToggleService = inject(FeatureToggleService);

	skipLinkHref = '#main-content';
	destroy = new ReplaySubject<boolean>(1);

	logout() {
		this.logOutEvent.emit();
	}

	ngOnInit(): void {
		this.router.events.pipe(takeUntil(this.destroy)).subscribe((event) => {
			if (event instanceof NavigationEnd) {
				const url = new URL(location.href);
				url.hash = '#main-content';
				this.skipLinkHref = url.toString();
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}
}
