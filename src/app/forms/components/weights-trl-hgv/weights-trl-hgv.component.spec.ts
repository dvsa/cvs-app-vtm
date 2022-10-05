import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';

import { WeightsTrlHgvComponent } from './weights-trl-hgv.component';

describe('WeightsTrlHgvComponent', () => {
  let component: WeightsTrlHgvComponent;
  let fixture: ComponentFixture<WeightsTrlHgvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [WeightsTrlHgvComponent],
      providers: [provideMockStore<State>({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsTrlHgvComponent);
    component = fixture.componentInstance;
    component.template = HgvWeight;
    component.data = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
