import { Meta, Story } from '@storybook/angular';

import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';

export default {
  title: 'Vehicle Tech Record',
  component: VehicleTechnicalRecordComponent,
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story = (args) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
 //👇 The args you need here will depend on your component
};
