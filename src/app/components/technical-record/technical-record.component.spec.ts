import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRecordComponent } from './technical-record.component';
import { TechnicalRecordService } from './technical-record.service';
import { HttpClientModule } from '@angular/common/http';

describe('TechnicalRecordComponent', () => {
  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [TechnicalRecordService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
