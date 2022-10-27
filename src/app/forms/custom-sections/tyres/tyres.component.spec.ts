import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyresComponent } from './tyres.component';

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TyresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
