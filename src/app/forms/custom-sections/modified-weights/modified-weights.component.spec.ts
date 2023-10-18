import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedWeightsComponent } from './modified-weights.component';

describe('ModifiedWeightsComponent', () => {
  let component: ModifiedWeightsComponent;
  let fixture: ComponentFixture<ModifiedWeightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifiedWeightsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModifiedWeightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
