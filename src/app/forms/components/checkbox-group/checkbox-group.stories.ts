import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseControlComponent } from '../base-control/base-control.component';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { array, boolean, number, object, text, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Forms/Checkbox group',
  component: CheckboxGroupComponent,
  args: {
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' }
    ]
  },
  argTypes: {
    label: {
      name: 'label',
      type: 'string',
      description: 'Fieldset label'
    }
  },
  decorators: [
    moduleMetadata({
      declarations: [CheckboxGroupComponent, BaseControlComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule]
    }),
    withKnobs
  ]
} as Meta;

const Template: Story = (args) => {
  const { label, options, name, hint, value = [], disabled = false, validators = [] } = args;
  const form = new FormGroup({ [name]: new FormControl({ value, disabled }, validators) });
  return {
    component: CheckboxGroupComponent,
    template: `<form [formGroup]="form"><app-checkbox-group [label]="label" [hint]="hint" [name]="name" [options]="options" [formControlName]="name"></app-checkbox-group></form> <pre>{{ form.value | json }}</pre>`,
    props: {
      form,
      label,
      name,
      options,
      hint
    }
  };
};

export const Enabled = Template.bind({});
Enabled.args = {
  label: 'Colors',
  name: 'colors'
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Enabled.args,
  disabled: true
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...Enabled.args,
  value: ['red'],
  hint: 'uncheck "Red" and click outside to see error message.',
  validators: [Validators.required]
};
