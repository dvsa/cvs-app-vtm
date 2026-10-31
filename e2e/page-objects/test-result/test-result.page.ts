import { AccordionGroup } from '../../components/accordion-group.component';
import { BasePage } from '../base.page';
import { AdditionalDefectsSection } from './sections/additional-defects.section';
import { DefectsSection } from './sections/defects.section';
import { NotesSection } from './sections/notes.section';
import { ReasonForCreationSection } from './sections/reason-for-creation.section';
import { RequiredStandardsSection } from './sections/required-standards.section';
import { SeatbeltsSection } from './sections/seatbelts.section';
import { TestSection } from './sections/test.section';
import { VehicleSection } from './sections/vehicle.section';
import { VisitSection } from './sections/visit.section';

export abstract class TestResultPage extends BasePage {
	readonly accordions = new AccordionGroup(this.page, 'accordian-show-all-button');
	readonly vehicle = new VehicleSection(this.page);
	readonly test = new TestSection(this.page);
	readonly seatbelts = new SeatbeltsSection(this.page);
	readonly visit = new VisitSection(this.page);
	readonly notes = new NotesSection(this.page);
	readonly defects = new DefectsSection(this.page);
	readonly requiredStandards = new RequiredStandardsSection(this.page);
	readonly additionalDefects = new AdditionalDefectsSection(this.page);
	readonly reasonForCreation = new ReasonForCreationSection(this.page);
}
