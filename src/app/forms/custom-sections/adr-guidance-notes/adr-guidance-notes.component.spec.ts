import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrGuidanceNotesComponent } from './adr-guidance-notes.component';

describe('AdrGuidanceNotesComponent', () => {
  let component: AdrGuidanceNotesComponent;
  let fixture: ComponentFixture<AdrGuidanceNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrGuidanceNotesComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrGuidanceNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
