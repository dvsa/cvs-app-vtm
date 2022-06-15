import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseControlComponent } from '../base-control/base-control.component';
import { RadioGroupComponent } from './radio-group.component';

export default {
  title: 'Forms/Radio button group',
  component: RadioGroupComponent,
  decorators: [
    moduleMetadata({
      declarations: [RadioGroupComponent, BaseControlComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule]
    })
  ]
} as Meta;

const Template: Story = (args) => {
  const { label, options, name, hint, value = null, disabled = false, validators = [] } = args;
  const form = new FormGroup({ [name]: new FormControl({ value, disabled }, validators) });
  return {
    component: RadioGroupComponent,
    template: `<form [formGroup]="form"><app-radio-group [label]="label" [hint]="hint" [name]="name" [options]="options" [formControlName]="name"></app-radio-group></form> <pre>{{ form.value | json }}</pre>`,
    props: {
      form,
      label,
      name,
      options,
      hint
    }
  };
};

const defaultArgs = {
  label: 'Colour picker',
  name: 'color',
  options: [
    { label: 'Red', value: 'red' },
    { label: 'Yellow', value: 'yellow', hint: 'this is the colour of the sun' },
    { label: 'Blue', value: 'blue', hint: 'this is the colour of the sea' }
  ],
  hint: 'These are the three primary colours'
};

export const Enabled = Template.bind({});
Enabled.args = {
  ...defaultArgs
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultArgs,
  disabled: true
};

export const Initilisation = Template.bind({});
Initilisation.args = {
  ...defaultArgs,
  value: 'red'
};
