import { formatDate } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { mockTestResult, mockTestResultArchived } from '@mocks/mock-test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { initialAppState } from '@store/.';
import { Observable } from 'rxjs';
import { TestAmendmentHistoryComponent } from './test-amendment-history.component';

describe('TestAmendmentHistoryComponent', () => {
  let component: TestAmendmentHistoryComponent;
  let fixture: ComponentFixture<TestAmendmentHistoryComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Created By', () => {
    it('should return testerName entry if createdByName does not exist', () => {
      const name = component.getCreatedByName(mockTestResultArchived());
      const testerName = 'John Smith';

      expect(name).toBe(testerName);
    });

    it('should return testerName entry if createdByName is empty', () => {
      const name = component.getCreatedByName({ ...mockTestResultArchived(), createdByName: '' });
      const testerName = 'John Smith';

      expect(name).toBe(testerName);
    });

    it('should return createdByName if createdByName not is empty', () => {
      const name = component.getCreatedByName(mockTestResult());
      const testerName = 'John Smith';
      const createdByName = 'Jane Doe';

      expect(name).toBe(createdByName);
      expect(name).not.toEqual(testerName);
    });
  });

  describe('Table', () => {
    it('should render on the DOM', () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();

      const heading = fixture.debugElement.query(By.css('.govuk-heading-m'));
      expect(heading).toBeTruthy();
      expect(heading.nativeElement.innerHTML).toBe('Test Record Amendment History');

      const table = fixture.debugElement.query(By.css('.govuk-table__body'));
      expect(table).toBeTruthy();
    });

    describe('Table sorting', () => {
      function titleCaseFirstWord(value: string) {
        return value[0].toUpperCase() + value.substring(1);
      }
      beforeEach(() => {
        component.testRecord = mockTestResult();
        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('.govuk-table__row'));
        expect(rows[0]).toBeTruthy();
      });
      it('should have first row be the current record', () => {
        const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
        expect(cells[0].nativeElement.innerHTML).toBe(titleCaseFirstWord(component.testRecord?.reasonForCreation!));
        expect(cells[1].nativeElement.innerHTML).toBe(component.testRecord?.createdByName);
        expect(cells[2].nativeElement.innerHTML).toBe(formatDate(component.testRecord?.createdAt!, 'MMM d, yyyy', 'en'));
        expect(cells[3].nativeElement.innerHTML).toBe('');
      });

      it('should have the second row be the most recent archived amendement version', () => {
        const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
        expect(cells[4].nativeElement.innerHTML).toBe(titleCaseFirstWord(component.testRecord?.testHistory![1].reasonForCreation!));
        expect(cells[5].nativeElement.innerHTML).toBe(component.testRecord?.testHistory![1].createdByName);
        expect(cells[6].nativeElement.innerHTML).toBe(formatDate(component.testRecord?.testHistory![1].createdAt!, 'MMM d, yyyy', 'en'));
        expect(cells[7].nativeElement.innerHTML).toContain('View');
      });
    });

    it('should have links to view amended records', async () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();
      jest.runAllTicks();

      const links = fixture.debugElement.queryAll(By.css('a'));

      links.forEach((e) => expect(e.nativeElement.innerHTML).toBe('View'));
      expect(links.length).toBe(component.testRecord.testHistory?.length);
    });
  });
});
