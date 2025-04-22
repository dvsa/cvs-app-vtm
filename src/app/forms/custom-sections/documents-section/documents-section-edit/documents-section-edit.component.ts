import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
	selector: 'app-documents-section-edit',
	templateUrl: './documents-section-edit.component.html',
	styleUrls: ['./documents-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule],
})
export class DocumentsSectionEditComponent implements OnInit, OnDestroy {
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();
	ngOnDestroy(): void {}

	ngOnInit(): void {}
}
