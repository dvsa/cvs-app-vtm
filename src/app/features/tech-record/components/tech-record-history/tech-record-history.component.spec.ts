import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRecordHistoryComponent } from './tech-record-history.component';

describe('TechRecordHistoryComponent', () => {
  let component: TechRecordHistoryComponent;
  let fixture: ComponentFixture<TechRecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechRecordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
