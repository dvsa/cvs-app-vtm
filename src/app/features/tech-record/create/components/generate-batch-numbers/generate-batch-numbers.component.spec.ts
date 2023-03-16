import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBatchNumbersComponent } from './generate-batch-numbers.component';

describe('GenerateBatchNumbersComponent', () => {
  let component: GenerateBatchNumbersComponent;
  let fixture: ComponentFixture<GenerateBatchNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateBatchNumbersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBatchNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
