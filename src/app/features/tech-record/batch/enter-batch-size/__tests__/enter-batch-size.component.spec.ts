import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterBatchSizeComponent } from '../enter-batch-size.component';

describe('EnterBatchSizeComponent', () => {
	let fixture: ComponentFixture<EnterBatchSizeComponent>;
	let component: EnterBatchSizeComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterBatchSizeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EnterBatchSizeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
