import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodesAdjacentComponent } from './view-nodes-adjacent.component';

describe('ViewNodesAdjacentComponent', () => {
  let component: ViewNodesAdjacentComponent;
  let fixture: ComponentFixture<ViewNodesAdjacentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNodesAdjacentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNodesAdjacentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
