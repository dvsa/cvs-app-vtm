import { Meta, Story } from '@storybook/angular';

import { HeaderComponent } from './header.component';

export default {
  title: 'Header',
  component: HeaderComponent,
  argTypes: { logOut: { action: 'clicked' } },
} as Meta;

export const Primary: Story = () => ({
  props: {
  },
});
