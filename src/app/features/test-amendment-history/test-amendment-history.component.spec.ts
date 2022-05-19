import { formatDate } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockTestResult, mockTestResultArchived } from '@mocks/mock-test-result';

import { TestAmendmentHistoryComponent } from './test-amendment-history.component';

describe('TestAmendmentHistoryComponent', () => {
  let component: TestAmendmentHistoryComponent;
  let fixture: ComponentFixture<TestAmendmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestAmendmentHistoryComponent]
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

  describe('Sorting', () => {
    it('should append amendment history entry with not date to the end', () => {
      const mock = { ...mockTestResult() };
      delete mock.createdAt;
      const randomOrderTestHistory = [
        { ...mock, createdAt: new Date('05 October 2011 14:48 UTC').toISOString(), reasonForCreation: 'different mock test' },
        { ...mock, reasonForCreation: 'amend test reason', createdByName: 'Barry Tone' },
        { ...mock, createdAt: new Date('05 October 2014 14:48 UTC').toISOString(), reasonForCreation: 'amend some data', createdByName: 'Barry Carr' },
        { ...mock, createdAt: new Date('23 June 2014 14:48 UTC').toISOString(), reasonForCreation: 'some thing was changed', createdByName: 'Sarah Mop' }
      ];
      const testHistory = component.sortedTestHistory(randomOrderTestHistory);
      const sortedTestHistory = [
        { ...mock, createdAt: new Date('05 October 2014 14:48 UTC').toISOString(), reasonForCreation: 'amend some data', createdByName: 'Barry Carr' },
        { ...mock, createdAt: new Date('23 June 2014 14:48 UTC').toISOString(), reasonForCreation: 'some thing was changed', createdByName: 'Sarah Mop' },
        { ...mock, createdAt: new Date('05 October 2011 14:48 UTC').toISOString(), reasonForCreation: 'different mock test' },
        { ...mock, reasonForCreation: 'amend test reason', createdByName: 'Barry Tone' }
      ];
      expect(testHistory).toEqual(sortedTestHistory);
    });

    it('should sort the amendment history by date', () => {
      const mock = { ...mockTestResult() };
      const randomOrderTestHistory = [
        { ...mock, createdAt: new Date('05 October 2011 14:48 UTC').toISOString(), reasonForCreation: 'different mock test' },
        { ...mock, createdAt: new Date('15 November 2013 14:48 UTC').toISOString(), reasonForCreation: 'amend test reason', createdByName: 'Barry Tone' },
        { ...mock, createdAt: new Date('05 October 2014 14:48 UTC').toISOString(), reasonForCreation: 'amend some data', createdByName: 'Barry Carr' },
        { ...mock, createdAt: new Date('23 June 2014 14:48 UTC').toISOString(), reasonForCreation: 'some thing was changed', createdByName: 'Sarah Mop' }
      ];
      const testHistory = component.sortedTestHistory(randomOrderTestHistory);
      const sortedTestHistory = [
        { ...mock, createdAt: new Date('05 October 2014 14:48 UTC').toISOString(), reasonForCreation: 'amend some data', createdByName: 'Barry Carr' },
        { ...mock, createdAt: new Date('23 June 2014 14:48 UTC').toISOString(), reasonForCreation: 'some thing was changed', createdByName: 'Sarah Mop' },
        { ...mock, createdAt: new Date('15 November 2013 14:48 UTC').toISOString(), reasonForCreation: 'amend test reason', createdByName: 'Barry Tone' },
        { ...mock, createdAt: new Date('05 October 2011 14:48 UTC').toISOString(), reasonForCreation: 'different mock test' }
      ];
      expect(testHistory).toEqual(sortedTestHistory);
    });
  });

  describe('Created By', () => {
    it('should return createdByName entry if not empty', () => {
      const name = component.getCreatedByName(mockTestResultArchived());
      const testerName = 'John Smith';

      expect(name).toBe(testerName);
    });

    it('should return testerName if createdByName is empty', () => {
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

    it('should have first row be the current record', () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.govuk-table__row'));
      expect(rows[0]).toBeTruthy();

      const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
      expect(cells[0].nativeElement.innerHTML).toBe(component.testRecord.testVersion);
      expect(cells[1].nativeElement.innerHTML).toBe(component.testRecord.reasonForCreation);
      expect(cells[2].nativeElement.innerHTML).toBe(component.testRecord.createdByName);
      expect(cells[3].nativeElement.innerHTML).toBe(formatDate(component.testRecord.createdAt!, 'MMM d, yyyy', 'en'));
      expect(cells[4].nativeElement.innerHTML).toBe('');
    });

    it('should have the second row be the most recent archived amendement version', () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('.govuk-table__row'));
      expect(rows[0]).toBeTruthy();

      const cells = fixture.debugElement.queryAll(By.css('.govuk-table__cell'));
      expect(cells[5].nativeElement.innerHTML).toBe(component.testRecord.testHistory![1].testVersion);
      expect(cells[6].nativeElement.innerHTML).toBe(component.testRecord.testHistory![1].reasonForCreation);
      expect(cells[7].nativeElement.innerHTML).toBe(component.testRecord.testHistory![1].createdByName);
      expect(cells[8].nativeElement.innerHTML).toBe(formatDate(component.testRecord.testHistory![1].createdAt!, 'MMM d, yyyy', 'en'));
      expect(cells[9].nativeElement.innerHTML).toContain('View');
    });

    it('should have links to view amended records', () => {
      component.testRecord = mockTestResult();
      fixture.detectChanges();

      const links = fixture.debugElement.query(By.css('a'));

      expect(links.nativeElement.innerHTML).toBe('View');
    });
  });
});
