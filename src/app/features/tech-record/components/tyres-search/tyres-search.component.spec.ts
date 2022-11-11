import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyresSearchComponent } from './tyres-search.component';

describe('TyresSearchComponent', () => {
  let component: TyresSearchComponent;
  let fixture: ComponentFixture<TyresSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyresSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
