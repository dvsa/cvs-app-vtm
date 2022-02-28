import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatesComponent } from './plates.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('PlatesComponent', () => {
  let component: PlatesComponent;
  let fixture: ComponentFixture<PlatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PlatesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatesComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.plates = [TESTING_UTILS.mockPlates()];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
