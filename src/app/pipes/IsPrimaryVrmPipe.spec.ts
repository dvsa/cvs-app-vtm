import { IsPrimaryVrmPipe } from './IsPrimaryVrmPipe';

const techRecords = [
  {
    vrm: '1234THF',
    isPrimary: true
  },
  {
    vrm: '5678THG',
    isPrimary: false
  }
];

describe('IsPrimaryVrmPipe', () => {
  const pipe = new IsPrimaryVrmPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return only primary vrm', () => {
    const expectedRes = [
      {
        vrm: '1234THF',
        isPrimary: true
      }
    ];
    const res = pipe.transform(techRecords, true);
    expect(res).toEqual(expectedRes);
  });

  it('should return only non-primary vrm', () => {
    const expectedRes = [
      {
        vrm: '5678THG',
        isPrimary: false
      }
    ];
    const res = pipe.transform(techRecords, false);
    expect(res).toEqual(expectedRes);
  });

  it('should return te original list', () => {
    const res = pipe.transform(null, false);
    expect(res).toEqual(undefined);
  });
});
