import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { ManufacturerEditComponent } from './manufacturer-edit.component';
import { TESTING_UTILS } from '@app/utils';

describe('ManufacturerEditComponent component', () => {
  let component: ManufacturerEditComponent;
  let fixture: ComponentFixture<ManufacturerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ManufacturerEditComponent],
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
    fixture = TestBed.createComponent(ManufacturerEditComponent);
    component = fixture.componentInstance;
    component.manufacturerEditDetails = TESTING_UTILS.mockManufacturer();
  });

  it('should render with the given properties ', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
