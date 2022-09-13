import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { TestType } from '@models/test-types/test-type.model';
import { Defect } from '@models/defects/defect.model';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { NumberPlateComponent } from '@shared/components/number-plate/number-plate.component';
import { TagComponent } from '@shared/components/tag/tag.component';
import { initialAppState } from '@store/.';
import { defects, DefectsState } from '@store/defects';
import { of } from 'rxjs';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';
import { TestResultSummaryComponent } from './test-result-summary.component';

describe('TestResultSummaryComponent', () => {
  let component: TestResultSummaryComponent;
  let fixture: ComponentFixture<TestResultSummaryComponent>;
  let routerService: RouterService;
  let store: MockStore<DefectsState>;
  let testRecordsService: TestRecordsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultSummaryComponent, VehicleHeaderComponent, NumberPlateComponent, TagComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TestResultsApiModule],
      providers: [provideMockStore({ initialState: initialAppState }), TestRecordsService, TechnicalRecordService, RouterService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultSummaryComponent);
    routerService = TestBed.inject(RouterService);
    store = TestBed.inject(MockStore);
    testRecordsService = TestBed.inject(TestRecordsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
