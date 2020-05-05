import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersOfAuthorisationComponent } from './letters-of-authorisation.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '../../utils/testing.utils';

describe('LettersOfAuthorisationComponent', () => {
  let component: LettersOfAuthorisationComponent;
  let fixture: ComponentFixture<LettersOfAuthorisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ LettersOfAuthorisationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersOfAuthorisationComponent);
    component = fixture.componentInstance;
    component.lettersOfAuth = TESTING_UTILS.mockLettersOfAuth();
  });


  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
