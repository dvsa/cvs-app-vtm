import { FORM_UTILS, FormControlsState } from '@app/utils/index.ts';
import { FormControl, FormGroup } from '@angular/forms';

describe('FORM_UTILS', () => {
  const formGroup = new FormGroup({});
  const controlsToAdd = [
    { name: 'test', fieldState: { value: 'test' } },
    { name: 'testArrayOfControls', fieldState: { value: [new FormControl('ctrl1')] } }
  ] as FormControlsState[];

  it('should add controls to the form group', () => {
    FORM_UTILS.addControlsToFormGroup(formGroup, controlsToAdd);

    expect(formGroup.get('test').value).toEqual('test');
    expect(formGroup.get('testArrayOfControls').value).toStrictEqual(['ctrl1']);
    expect(formGroup).toMatchSnapshot();
  });
});
