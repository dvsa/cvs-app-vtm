import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellPage } from './shell.page';

describe('ShellPage', () => {
  let component: ShellPage;
  let fixture: ComponentFixture<ShellPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShellPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellPage);
    component = fixture.componentInstance;
  });

  it('should create shell component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
