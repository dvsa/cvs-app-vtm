import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Meta, Story } from '@storybook/angular';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';

export default {
	title: 'Vehicle Tech Record',
	component: VehicleTechnicalRecordComponent,
} as Meta;

const Template: Story = (args) => ({
	props: args,
});

export const Primary = Template.bind({});
Primary.args = {
	vehicleTechRecord: mockVehicleTechnicalRecord(),
};
