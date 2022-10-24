import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';

import { AbandonDialogComponent } from './abandon-dialog.component';

describe('AbandonDialogComponent', () => {
  let component: AbandonDialogComponent;
  let fixture: ComponentFixture<AbandonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbandonDialogComponent],
      imports: [DynamicFormsModule, SharedModule],
      providers: [provideMockStore({ initialState: initialAppState }), DynamicFormService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
