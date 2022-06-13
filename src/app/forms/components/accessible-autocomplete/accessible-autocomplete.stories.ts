import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AccessibleAutocompleteComponent } from './accessible-autocomplete.component';

export default {
  title: 'Forms/Autocomplete',
  component: AccessibleAutocompleteComponent,
  decorators: [
    moduleMetadata({
      declarations: [AccessibleAutocompleteComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule]
    })
  ]
} as Meta;

const Template: Story = (args) => {
  const { id, label, options, name, hint, value = null, disabled = false, validators = [] } = args;
  const form = new FormGroup({ [name]: new FormControl({ value, disabled }, validators) });
  return {
    component: AccessibleAutocompleteComponent,
    template: `<form [formGroup]="form"><app-accessible-autocomplete [label]="label" [id]="id" [name]="name" [options]="options" [formControlName]="name">  </app-accessible-autocomplete></form>`,
    props: {
        id,
        label,
        hint,
        name,
        options
      }
    }
  };

  const defaultArgs = {
    label: 'Accesibility Autocomplete',
    hint: 'Type any letter to start searching',
    name: 'name',
    id: 'name' + '-wrapper',
    options: ['red', 'yellow', 'blue','green']
    ,
  };

  export const Enabled = Template.bind({});
    Enabled.args = {
  ...defaultArgs
};