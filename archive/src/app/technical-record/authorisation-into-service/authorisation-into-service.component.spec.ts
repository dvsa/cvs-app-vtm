import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationIntoServiceComponent } from './authorisation-into-service.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '../../utils/testing.utils';

describe('AuthorisationIntoServiceComponent', () => {
  let component: AuthorisationIntoServiceComponent;
  let fixture: ComponentFixture<AuthorisationIntoServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AuthorisationIntoServiceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorisationIntoServiceComponent);
    component = fixture.componentInstance;
    component.authIntoService = TESTING_UTILS.mockAuthoIntoService();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
