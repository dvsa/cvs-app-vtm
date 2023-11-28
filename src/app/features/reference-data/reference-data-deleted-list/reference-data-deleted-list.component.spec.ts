import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list.component';

describe('DataTypeListComponent', () => {
  let component: ReferenceDataDeletedListComponent;
  let fixture: ComponentFixture<ReferenceDataDeletedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataDeletedListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, { provide: UserService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataDeletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
