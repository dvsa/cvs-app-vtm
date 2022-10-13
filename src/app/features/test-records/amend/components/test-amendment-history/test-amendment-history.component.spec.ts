import { formatDate } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { mockTestResult, mockTestResultArchived } from '@mocks/mock-test-result';
import { TestResultModel } from '@models/test-results/test-result.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { initialAppState, State } from '@store/.';
import { selectedTestSortedAmendmentHistory } from '@store/test-records';
import { createMock, createMockList } from 'ts-auto-mock';
import { TestAmendmentHistoryComponent } from './test-amendment-history.component';

describe('TestAmendmentHistoryComponent', () => {
  let component: TestAmendmentHistoryComponent;
  let fixture: ComponentFixture<TestAmendmentHistoryComponent>;
  let store: MockStore<State>;
  const pipe = new DefaultNullOrEmpty();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestAmendmentHistoryComponent, DefaultNullOrEmpty],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAmendmentHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Created By', () => {
    it('should return testerName entry if createdByName does not exist', () => {
      const data = mockTestResultArchived();
      delete data.createdByName;
      const name = component.getCreatedByName(data);

      expect(name).toBe(data.testerName);
    });

    it('should return testerName entry if createdByName is empty', () => {
      const data = { ...mockTestResultArchived(), createdByName: '' };
      const name = component.getCreatedByName(data);

      expect(name).toBe(data.testerName);
    });

    it('should return createdByName if createdByName not is empty', () => {
      const name = component.getCreatedByName(mockTestResult());

      expect(name).toBe(mockTestResult().createdByName);
      expect(name).not.toEqual(mockTestResult().testerName);
    });
  });

  describe('Table', () => {
    it('should render on the DOM', () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();

      const heading = fixture.debugElement.query(By.css('.govuk-table__caption'));
      expect(heading).toBeTruthy();
      expect(heading.nativeElement.innerHTML).toContain('Test record amendment history');

      const table = fixture.debugElement.query(By.css('.govuk-table__body'));
      expect(table).toBeTruthy();
    });

    describe('Table sorting', () => {
      beforeEach(() => {
        component.testRecord = createMock<TestResultModel>({
          createdAt: '2020-01-01T00:00:00.000Z',
          reasonForCreation: 'reasonForCreation',
          createdByName: 'Tester Man',
          testHistory: createMockList<TestResultModel>(1, i =>
            createMock<TestResultModel>({
              createdAt: new Date(`2020-01-0${i + 1}`).toISOString()
            })
          )
        });
        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('.govuk-table__row'));
        expect(rows[0]).toBeTruthy();
      });

      it('should have first row be the current record', () => {
        const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
        expect(cells[0].nativeElement.innerHTML).toBe(pipe.transform(component.testRecord?.reasonForCreation!));
        expect(cells[1].nativeElement.innerHTML).toBe(component.testRecord?.createdByName);
        expect(cells[2].nativeElement.innerHTML).toBe(formatDate(component.testRecord?.createdAt!, 'MMM d, yyyy', 'en'));
        expect(cells[3].nativeElement.innerHTML).toBe('');
      });

      it('should have the second row be the first entry from amendement version history', fakeAsync(() => {
        store.overrideSelector(selectedTestSortedAmendmentHistory, component.testRecord!.testHistory!);
        tick();
        fixture.detectChanges();
        const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
        expect(cells[4].nativeElement.innerHTML).toBe(pipe.transform(component.testRecord?.testHistory![0].reasonForCreation!));
        expect(cells[5].nativeElement.innerHTML).toBe(pipe.transform(component.testRecord?.testHistory![0].createdByName));
        expect(cells[6].nativeElement.innerHTML).toBe(formatDate(component.testRecord?.testHistory![0].createdAt!, 'MMM d, yyyy', 'en'));
        expect(cells[7].nativeElement.innerHTML).toContain('View');
      }));
    });

    it('should have links to view amended records', fakeAsync(() => {
      component.testRecord = mockTestResult();
      store.overrideSelector(selectedTestSortedAmendmentHistory, component.testRecord!.testHistory!);
      tick();
      fixture.detectChanges();

      const links = fixture.debugElement.queryAll(By.css('a'));

      links.forEach(e => expect(e.nativeElement.innerHTML).toBe('View'));
      expect(links.length).toBe(component.testRecord?.testHistory?.length);
    }));
  });
});
