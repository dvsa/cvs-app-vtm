import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageButtonComponent } from './landing-page-button.component';

describe('LandingPageButtonComponent', () => {
  let component: LandingPageButtonComponent;
  let fixture: ComponentFixture<LandingPageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
