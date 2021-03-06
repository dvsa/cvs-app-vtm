import { BackButtonDirective } from './back-button.directive';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';

describe('BackButtonDirective', () => {
  let directive: BackButtonDirective;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: Location, useClass: SpyLocation }]
    }).compileComponents();

    location = TestBed.get(Location);
    directive = new BackButtonDirective(location);
  }));

  it('should create an instance', async(() => {
    expect(directive).toBeTruthy();
  }));

  it('should call the navigate back on click', () => {
    jest.spyOn(location, 'back');
    directive.onClick();
    expect(location.back).toHaveBeenCalled();
  });
});
