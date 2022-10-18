import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonDialogComponent } from './abandon-dialog.component';

describe('AbandonDialogComponent', () => {
  let component: AbandonDialogComponent;
  let fixture: ComponentFixture<AbandonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
