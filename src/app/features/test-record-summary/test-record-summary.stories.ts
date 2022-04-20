import { Meta, Story } from '@storybook/angular';
import { TestRecordSummaryComponent } from './test-record-summary.component';
import { TestResultModel } from '../../models/test-result.model';

const fakeRecord: TestResultModel = {
  testResultId: 'test',
  systemNumber: 'test',
  testStartTimestamp: 'testStartTimestamp',
  testStatus: 'testStatus',
  testTypes: [],
  vin: 'vin'
};

export default {
  title: 'Test Record Summary',
  component: TestRecordSummaryComponent
} as Meta;

export const NoRecords: Story = () => ({
  props: {}
});

export const Record: Story = () => ({
  props: { testRecords: [fakeRecord] }
});

export const Records: Story = () => ({
  props: { testRecords: [fakeRecord, { ...fakeRecord, testStartTimestamp: '2022-02-02:13.23', vin: 'xthoeu213', testStatus: 'PASSED' }] }
});
