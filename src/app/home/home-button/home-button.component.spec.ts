import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeButtonComponent } from './home-button.component';

describe('HomeButtonComponent', () => {
  let component: HomeButtonComponent;
  let fixture: ComponentFixture<HomeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
