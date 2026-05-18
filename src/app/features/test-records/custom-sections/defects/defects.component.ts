import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { Modes } from '@/src/app/models/modes.enum';
import { TruncatePipe } from '@/src/app/pipes/truncate/truncate.pipe';
import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { TestService } from '@/src/app/services/test/test.service';
import { testResultInEdit } from '@/src/app/store/test-records';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-defects',
	templateUrl: './defects.component.html',
	imports: [ButtonComponent, RouterLink, TruncatePipe, TagComponent],
	styleUrls: ['./defects.component.scss'],
})
export class DefectsComponent {
	store = inject(Store);
	testService = inject(TestService);
	defectMediaService = inject(DefectMediaService, { optional: true });

	mode = input.required<Modes>();

	testResult = this.store.selectSignal(testResultInEdit);

	readonly Modes = Modes;

	categoryColor(category: string): string {
		return categoryColors[category as keyof typeof categoryColors];
	}
}

const categoryColors = {
	major: 'orange',
	minor: 'yellow',
	dangerous: 'red',
	advisory: 'blue',
} as const;
