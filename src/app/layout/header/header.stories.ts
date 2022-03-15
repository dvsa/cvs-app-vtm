import { Meta, Story } from '@storybook/angular';

import { HeaderComponent } from './header.component';

export default {
  title: 'Header',
  component: HeaderComponent,
  argTypes: { logOut: { action: 'clicked' } }
} as Meta;

const Template: Story<Header> = (args: Header) => ({
  props: args
});

export const Primary: Story = () => ({
  props: {
    username: 'username'
  }
});
