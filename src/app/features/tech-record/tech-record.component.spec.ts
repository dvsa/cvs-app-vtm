import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRecordComponent } from './tech-record.component';

describe('TechRecordComponent', () => {
  let component: TechRecordComponent;
  let fixture: ComponentFixture<TechRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
