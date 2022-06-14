import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSearchResultComponent } from './single-search-result.component';

describe('SingleSearchResultComponent', () => {
  let component: SingleSearchResultComponent;
  let fixture: ComponentFixture<SingleSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSearchResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
