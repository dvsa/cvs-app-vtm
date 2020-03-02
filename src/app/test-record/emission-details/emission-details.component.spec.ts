import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmissionDetailsComponent } from './emission-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';

describe('EmissionDetailsComponent', () => {
  let component: EmissionDetailsComponent;
  let fixture: ComponentFixture<EmissionDetailsComponent>;
  const testType = {} as TestType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EmissionDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionDetailsComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
