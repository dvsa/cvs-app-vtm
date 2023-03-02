import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { RetrieveDocumentDirective } from '@shared/directives/retrieve-document/retrieve-document.directive';
import { TestCertificateComponent } from './test-certificate.component';

describe('TestCertificateComponent', () => {
  let component: TestCertificateComponent;
  let fixture: ComponentFixture<TestCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetrieveDocumentDirective, TestCertificateComponent],
      imports: [HttpClientTestingModule],
      providers: [DocumentRetrievalService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
