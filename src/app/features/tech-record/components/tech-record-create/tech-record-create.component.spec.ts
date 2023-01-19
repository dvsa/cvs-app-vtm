import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRecordCreateComponent } from './tech-record-create.component';

describe('TechRecordCreateComponent', () => {
  let component: TechRecordCreateComponent;
  let fixture: ComponentFixture<TechRecordCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordCreateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
