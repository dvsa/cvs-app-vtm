import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrGenerateCertificateComponent } from './adr-generate-certificate.component';

describe('AdrGenerateCertificateComponent', () => {
  let component: AdrGenerateCertificateComponent;
  let fixture: ComponentFixture<AdrGenerateCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrGenerateCertificateComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrGenerateCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
