import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListItemComponent } from './view-list-item.component';

describe('ListItemOutputComponent', () => {
  let component: ViewListItemComponent;
  let fixture: ComponentFixture<ViewListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewListItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
