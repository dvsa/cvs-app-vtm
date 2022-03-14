import { Meta, Story } from '@storybook/angular';

import { SearchComponent } from './search.component';

export default {
  title: 'Search Page',
  component: SearchComponent,
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story = (args) => ({
  props: args,
});

export const Initial = Template.bind({});
Initial.args = {
 //👇 The args you need here will depend on your component
};

export const Loading = Template.bind({});
Loading.args = {

}

export const Error = Template.bind({});
Error.args = {

}
