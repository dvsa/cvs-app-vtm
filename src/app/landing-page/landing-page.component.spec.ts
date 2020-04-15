import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { RouterTestingModule } from '@angular/router/testing';



describe('LandingPage', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
  });

  it('should create landing component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
