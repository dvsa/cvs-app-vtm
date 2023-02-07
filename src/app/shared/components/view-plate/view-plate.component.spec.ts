import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { ViewPlateComponent } from './view-plate.component';

describe('ViewPlateComponent', () => {
  let component: ViewPlateComponent;
  let fixture: ComponentFixture<ViewPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPlateComponent],
      imports: [HttpClientTestingModule],
      providers: [DocumentRetrievalService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
