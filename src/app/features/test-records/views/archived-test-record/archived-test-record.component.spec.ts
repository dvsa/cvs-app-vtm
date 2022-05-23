import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';

import { ArchivedTestRecordComponent } from './archived-test-record.component';

describe('ArchivedTestRecordComponent', () => {
  let component: ArchivedTestRecordComponent;
  let fixture: ComponentFixture<ArchivedTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchivedTestRecordComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
