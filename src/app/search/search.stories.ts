import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search.component';

export default {
  title: 'Search Page',
  component: SearchComponent,
  decorators: [
    moduleMetadata({
      declarations: [SearchComponent],
      imports: [HttpClientModule],
    }),
  ],
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Initial = Template.bind({});
Initial.args = {
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
}

export const Error = Template.bind({});
Error.args = {
  searchError: 'This is an error',
}
