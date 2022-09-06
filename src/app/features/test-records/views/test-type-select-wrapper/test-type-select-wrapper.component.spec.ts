import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTypeSelectWrapperComponent } from './test-type-select-wrapper.component';

describe('TestTypeSelectWrapperComponent', () => {
  let component: TestTypeSelectWrapperComponent;
  let fixture: ComponentFixture<TestTypeSelectWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTypeSelectWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypeSelectWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
