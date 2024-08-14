import { Meta, Story } from '@storybook/angular';
import { GlobalErrorComponent } from './global-error.component';

export default {
	title: 'Global Error Component',
	component: GlobalErrorComponent,
} as Meta;

export const NoErrors: Story = () => ({
	props: {},
});

export const Error: Story = () => ({
	props: { errorMessage$: 'error' },
});
