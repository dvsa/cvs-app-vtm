import { FormGroupDirective, FormGroup } from '@angular/forms';
import { ApplicantDetails } from './../models/adr-details';

export const TESTING_UTILS = {
  mockApplicantDetails,
  mockFormGroupDirective
};

function mockFormGroupDirective(): FormGroupDirective {
  const fgd: FormGroupDirective = new FormGroupDirective([], []);
  fgd.form = new FormGroup({});
  return fgd;
}

function mockApplicantDetails(args?: Partial<ApplicantDetails>): ApplicantDetails {
  const mock: ApplicantDetails = {
    name: 'Ben',
    street: 'Robert green',
    city: 'Birmingham',
    town: 'lala land',
    postcode: 'NG4 12Z'
  };

  return { ...mock, ...args };
}
