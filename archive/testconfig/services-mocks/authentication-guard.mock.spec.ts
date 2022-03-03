import { AuthenticationGuardMock } from './authentication-guard.mock';

describe('AuthenticationGuardMock', () => {
  let authenticationGuardMock: AuthenticationGuardMock;
  beforeEach(() => {
    authenticationGuardMock = new AuthenticationGuardMock();
  });

  test('login', () => {
    expect(authenticationGuardMock.login()).toEqual(undefined);
  });

  test('logout', () => {
    expect(authenticationGuardMock.logout()).toEqual(undefined);
  });

  test('GetResourceForEndpoint', () => {
    expect(authenticationGuardMock.GetResourceForEndpoint()).toEqual('mock');
  });

  test('RenewToken', () => {
    expect(authenticationGuardMock.RenewToken()).toEqual(undefined);
  });

  test('acquireToken', () => {
    authenticationGuardMock.acquireToken().subscribe(res =>
      expect(res).toMatchObject({ token: '342304932049234' })
    );
  });

  test('getToken', () => {
    expect(authenticationGuardMock.getToken()).toEqual('token');
  });

  test('handleCallback', () => {
    expect(authenticationGuardMock.handleCallback()).toEqual(undefined);
  });
});