import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRecordComponent } from './technical-record.component';

describe('TechnicalRecordComponent', () => {
  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordComponent ]
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
