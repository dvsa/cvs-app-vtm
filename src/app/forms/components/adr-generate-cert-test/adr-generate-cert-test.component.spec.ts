import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrGenerateCertTestComponent } from './adr-generate-cert-test.component';

describe('AdrGenerateCertTestComponent', () => {
  let component: AdrGenerateCertTestComponent;
  let fixture: ComponentFixture<AdrGenerateCertTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdrGenerateCertTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdrGenerateCertTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
