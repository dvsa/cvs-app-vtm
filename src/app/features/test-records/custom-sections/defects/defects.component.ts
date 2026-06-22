import { ButtonComponent } from '@/src/app/components/button/button.component';
import { DefectMediaDownloadComponent } from '@/src/app/components/defect-media-download/defect-media-download.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TruncatePipe } from '@/src/app/pipes/truncate/truncate.pipe';
import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { DocumentsService } from '@/src/app/services/documents/documents.service';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-defects',
	templateUrl: './defects.component.html',
	imports: [ButtonComponent, RouterLink, TruncatePipe, TagComponent, DefectMediaDownloadComponent],
	styleUrls: ['./defects.component.scss'],
})
export class DefectsComponent {
	http = inject(HttpClient);
	store = inject(Store);
	documentsService = inject(DocumentsService);
	router = inject(Router);
	globalErrorService = inject(GlobalErrorService);
	defectMediaService = inject(DefectMediaService, { optional: true });
	testService = inject(TestService);

	mode = input.required<Modes>();

	testResult = this.store.selectSignal(toEditOrNotToEdit);

	readonly Modes = Modes;

	get defects(): DefectDetailsSchema[] {
		return this.testResult()?.testTypes[0].defects || [];
	}

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
