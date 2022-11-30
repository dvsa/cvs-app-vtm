import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IconComponent } from '../icon/icon.component';
import { ModalComponent } from '../modal/modal.component';
import { TestCertificateComponent } from './test-certificate.component';

describe('TestCertificateComponent', () => {
  let component: TestCertificateComponent;
  let fixture: ComponentFixture<TestCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestCertificateComponent, IconComponent, ModalComponent],
      imports: [HttpClientTestingModule, PdfViewerModule],
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
