import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdaComponent } from './dda.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('DdaComponent', () => {
  let component: DdaComponent;
  let fixture: ComponentFixture<DdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DdaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdaComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.ddaDetails = TESTING_UTILS.mockDDA();
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
