import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestSectionsComponent } from './test-sections.component';

describe.skip('TestSectionsComponent', () => {
  let component: TestSectionsComponent;
  let fixture: ComponentFixture<TestSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestSectionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
