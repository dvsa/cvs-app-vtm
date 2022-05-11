import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseControlComponent } from '../base-control/base-control.component';
import { CheckboxGroupComponent } from './checkbox-group.component';

export default {
  title: 'Forms/Checkbox group',
  component: CheckboxGroupComponent,
  decorators: [
    moduleMetadata({
      declarations: [CheckboxGroupComponent, BaseControlComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule]
    })
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

const defaultArgs = {
  label: 'Colors',
  name: 'colors',
  options: [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' }
  ]
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

export const Invalid = Template.bind({});
Invalid.args = {
  ...defaultArgs,
  value: ['red'],
  hint: 'uncheck "Red" and click outside to see error message.',
  validators: [Validators.required]
};
