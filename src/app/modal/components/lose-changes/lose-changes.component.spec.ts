import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoseChangesComponent } from './lose-changes.component';

describe('LoseChangesComponent', () => {
  let component: LoseChangesComponent;
  let fixture: ComponentFixture<LoseChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoseChangesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoseChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create lose changes modal component', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should emit true on lose changes modal', () => {
    spyOn(component.okCancelAction, 'emit');
    component.onLoseChangesClick();
    expect(component.okCancelAction.emit).toHaveBeenCalledWith({ isOk: true });
  });

  it('should emit false on continue doing changes', () => {
    spyOn(component.okCancelAction, 'emit');
    component.onCancelClick();
    expect(component.okCancelAction.emit).toHaveBeenCalledWith({ isOk: false });
  });
});
