import { BackButtonDirective } from './back-button.directive';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';

describe('BackButtonDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: Location, useClass: SpyLocation }]
    }).compileComponents();
  }));

  it('should create an instance', async(() => {
    const location = TestBed.get(Location);
    const directive = new BackButtonDirective(location);
    expect(directive).toBeTruthy();
  }));
});
