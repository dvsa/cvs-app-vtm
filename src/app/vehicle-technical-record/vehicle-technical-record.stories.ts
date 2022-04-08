import { Meta, Story } from '@storybook/angular';

import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import * as vtrMock from '../../mocks/vehicleTechnicalRecord.mock';

export default {
  title: 'Vehicle Tech Record',
  component: VehicleTechnicalRecordComponent,
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  vehicleTechRecord: vtrMock.default,
};
