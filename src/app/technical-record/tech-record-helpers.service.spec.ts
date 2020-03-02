import { TestBed, getTestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from './tech-record-helpers.service';

describe('TechRecordHelpersService', () => {

  let injector: TestBed;
  let service: TechRecordHelpersService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [TechRecordHelpersService]
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(TechRecordHelpersService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check for empty string', () => {
    const customObject = '';
    const result = service.isNullOrEmpty(customObject);

    expect(result).toEqual(true);
  });

  it('should check for null', () => {
    const customObject = null;
    const result = service.isNullOrEmpty(customObject);

    expect(result).toEqual(true);
  });

  it('should check for undefinded', () => {
    const customObject = undefined;
    const result = service.isNullOrEmpty(customObject);

    expect(result).toEqual(true);
  });

  it('should check for non empty string', () => {
    const customObject = 'one';
    const result = service.isNullOrEmpty(customObject);

    expect(result).toEqual(false);
  });

  it('should check for non empty number', () => {
    const customObject = 123;
    const result = service.isNullOrEmpty(customObject);

    expect(result).toEqual(false);
  });

  it('should check if object is empty', () => {
    expect(service.isEmptyObject({})).toBeTruthy();
  });

  it('should check if object is empty', () => {
    expect(service.isEmptyObject({})).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
