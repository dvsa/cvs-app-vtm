import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { DefectComponent } from './defect.component';

describe('DefectComponent', () => {
  let component: DefectComponent;
  let fixture: ComponentFixture<DefectComponent>;

  const fakeActivatedRoute = {
    snapshot: { data: { key: 'value' } }
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, DynamicFormsModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
