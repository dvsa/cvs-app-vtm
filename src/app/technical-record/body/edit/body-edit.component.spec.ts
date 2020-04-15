import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup
} from '@angular/forms';

import { BodyEditComponent } from './body-edit.component';
import { TESTING_UTILS } from '@app/utils';
import { IBody } from '@app/models/body-type';

describe('BodyEditComponent component', () => {
  let component: BodyEditComponent;
  let fixture: ComponentFixture<BodyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [BodyEditComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyEditComponent);
    component = fixture.componentInstance;
  });

  it('should render with the given properties ', () => {
    component.bodyDetails = {
      make: 'Marc',
      model: 'honda',
      functionCode: 'a',
      conversionRefNo: 'x239f',
      bodyType: TESTING_UTILS.mockBodyType()
    } as IBody;

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
