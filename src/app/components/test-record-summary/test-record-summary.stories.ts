import { Meta, Story } from '@storybook/angular';

import { TestRecordSummaryComponent } from './test-record-summary.component';

export default {
  title: 'Test Record Summary',
  component: TestRecordSummaryComponent
} as Meta;

export const Primary: TestRecordSummaryComponent = () => ({
  props: {}
});
