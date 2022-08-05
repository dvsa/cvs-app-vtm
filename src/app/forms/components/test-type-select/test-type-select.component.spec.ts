import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { RequiredSection } from '@forms/templates/test-records/section-templates/required/required-hidden-section.template';
import { provideMockStore } from '@ngrx/store/testing';
import { TestTypesService } from '@services/test-types/test-types.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { TestTypeNamePipe } from './test-type-name.pipe';
import { TestTypeSelectComponent } from './test-type-select.component';

describe('TestTypeSelectComponent', () => {
  let component: TestTypeSelectComponent;
  let fixture: ComponentFixture<TestTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTypeSelectComponent, TestTypeNamePipe],
      providers: [
        DynamicFormService,
        provideMockStore({ initialState: initialAppState }),
        { provide: TestTypesService, useValue: { selectAllTestTypes$: of([]) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypeSelectComponent);
    component = fixture.componentInstance;
    component.template = RequiredSection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
