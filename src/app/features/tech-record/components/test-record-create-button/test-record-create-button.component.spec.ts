import { TestRecordCreateButtonComponent } from './test-record-create-button.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { By } from '@angular/platform-browser';

describe('TestRecordSummaryComponent', () => {
  let component: TestRecordCreateButtonComponent;
  let fixture: ComponentFixture<TestRecordCreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRecordCreateButtonComponent],
      imports: [RouterTestingModule, SharedModule, RouterTestingModule.withRoutes([{ path: 'test', component: TestRecordCreateButtonComponent }])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordCreateButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct url to redirect to', () => {
    fixture.detectChanges();

    const href = fixture.debugElement.query(By.css('#create-test')).nativeElement.getAttribute('href');

    expect(href).toBe('/test-records/create-test/type');
  });
});
