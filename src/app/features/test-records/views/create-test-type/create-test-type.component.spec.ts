import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestTypeComponent } from './create-test-type.component';

describe('CreateTestTypeComponent', () => {
  let component: CreateTestTypeComponent;
  let fixture: ComponentFixture<CreateTestTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTestTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
