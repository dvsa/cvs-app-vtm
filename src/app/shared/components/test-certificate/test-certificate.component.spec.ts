import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/index';
import { TestCertificateComponent } from './test-certificate.component';

describe('TestCertificateComponent', () => {
  let component: TestCertificateComponent;
  let fixture: ComponentFixture<TestCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestCertificateComponent],
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), RouterService, DocumentRetrievalService]
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
