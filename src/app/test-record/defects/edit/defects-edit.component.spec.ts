import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsEditComponent } from './defects-edit.component';

describe('DefectsEditComponent', () => {
  let component: DefectsEditComponent;
  let fixture: ComponentFixture<DefectsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefectsEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
