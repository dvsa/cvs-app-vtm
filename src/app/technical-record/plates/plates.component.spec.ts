import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatesComponent } from './plates.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('PlatesComponent', () => {
  let component: PlatesComponent;
  let fixture: ComponentFixture<PlatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PlatesComponent,],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatesComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.plates = [{
      plateSerialNumber: '123123',
      plateIssueDate: '2019-12-13',
      plateReasonForIssue: '5678',
      plateIssuer: 'Issuer1'
      }];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
