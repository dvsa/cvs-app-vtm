import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomControlComponentComponent } from './custom-control-component.component';

describe('CustomControlComponentComponent', () => {
  let component: CustomControlComponentComponent;
  let fixture: ComponentFixture<CustomControlComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomControlComponentComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomControlComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
