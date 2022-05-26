import { Meta, Story } from '@storybook/angular';

import { HeaderComponent } from './header.component';

export default {
  title: 'Header',
  component: HeaderComponent,
  argTypes: { logOut: { action: 'clicked' } }
} as Meta;

const Template: Story = () => ({
  props: {}
});

export const Primary: Story = () => ({
  props: {
    username: 'username'
  }
});
