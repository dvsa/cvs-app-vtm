
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDataTableComponent } from './ngx-data-table.component';
import { MatTableModule } from '@angular/material';

describe('NgxDataTableComponent', () => {
  let component: NgxDataTableComponent;
  let fixture: ComponentFixture<NgxDataTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDataTableComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [ MatTableModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
