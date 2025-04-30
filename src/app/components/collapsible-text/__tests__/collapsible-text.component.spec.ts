import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleTextComponent } from '../collapsible-text.component';

describe('CollapsibleTextComponent', () => {
	let component: CollapsibleTextComponent;
	let fixture: ComponentFixture<CollapsibleTextComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CollapsibleTextComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CollapsibleTextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should open when open method is called', () => {
		component.isCollapsed.set(true);
		component.open();
		expect(component.isCollapsed()).toBe(false);
	});

	it('should close when close method is called', () => {
		component.isCollapsed.set(false);
		component.close();
		expect(component.isCollapsed()).toBe(true);
	});
});
