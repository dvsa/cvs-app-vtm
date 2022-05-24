import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordComponent } from './tech-record.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerService } from '../../layout/spinner/spinner.service';

describe('TechRecordComponent', () => {
  let service: SpinnerService;
  let component: TechRecordComponent;
  let fixture: ComponentFixture<TechRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TechRecordComponent ],
      providers: [SpinnerService, provideMockStore({ initialState: initialAppState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
