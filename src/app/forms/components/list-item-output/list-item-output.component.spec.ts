import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemOutputComponent } from './list-item-output.component';

describe('ListItemOutputComponent', () => {
  let component: ListItemOutputComponent;
  let fixture: ComponentFixture<ListItemOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemOutputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
