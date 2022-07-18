import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AutocompleteComponent } from './autocomplete.component';

export default {
  title: 'Forms/Autocomplete',
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      declarations: [AutocompleteComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule]
    })
  ]
} as Meta;

const Template: Story = args => {
  const { id, label, options, name, hint, defaultValue = 'red', disabled = false, validators = [] } = args;
  const form = new FormGroup({ [name]: new FormControl({ defaultValue, disabled }, validators) });
  return {
    component: AutocompleteComponent,
    template: `<form [formGroup]="form"><app-autocomplete [defaultValue]="defaultValue" [label]="label" [id]="id" [name]="name" [options]="options" [formControlName]="name">  </app-autocomplete></form>`,
    props: {
      id,
      label,
      hint,
      name,
      options,
      defaultValue
    }
  };
};

const defaultArgs = {
  label: 'Autocomplete',
  hint: 'Type any letter to start searching',
  name: 'name',
  id: 'name' + '-wrapper',
  options: ['red', 'yellow', 'blue', 'green'],
  defaultValue: 'red'
};

export const Enabled = Template.bind({});
Enabled.args = {
  ...defaultArgs
};
