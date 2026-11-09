import { environment } from '@environments/environment';
import { Roles } from '@models/roles.enum';
import { Login, Logout } from '../user-service.actions';
import {
	STORE_FEATURE_USER_KEY,
	employeeId,
	id,
	initialState,
	jobTitle,
	name,
	roles,
	user,
	userEmail,
	userServiceReducer,
} from '../user-service.reducer';

describe('User service reducer and selectors', () => {
	const loginDetails = {
		name: 'Test User',
		userEmail: 'test.user@example.com',
		oid: 'user-1',
		employeeId: 'employee-1',
		jobTitle: 'Vehicle examiner',
		roles: ['TechRecord.View', 'TestResult.View'],
	};
	let removeFullAccessRole: boolean;

	beforeEach(() => {
		removeFullAccessRole = environment.RemoveAADFullAccessRole;
	});

	afterEach(() => {
		environment.RemoveAADFullAccessRole = removeFullAccessRole;
	});

	it('starts logged out and ignores unrelated actions', () => {
		expect(userServiceReducer(undefined, { type: 'init' })).toEqual(initialState);
		const state = userServiceReducer(undefined, Login(loginDetails));
		expect(userServiceReducer(state, { type: 'unrelated' })).toBe(state);
	});

	it('replaces the previous user details on login', () => {
		const previous = userServiceReducer(undefined, Login(loginDetails));
		const nextUser = { name: 'Next User', userEmail: 'next@example.com', oid: 'user-2', employeeId: null };
		expect(userServiceReducer(previous, Login(nextUser))).toEqual({ ...nextUser, roles: [], jobTitle: undefined });
		expect(previous).toEqual(loginDetails);
	});

	it('clears personal details and roles on logout', () => {
		const state = userServiceReducer(undefined, Login(loginDetails));
		expect(userServiceReducer(state, Logout())).toEqual(initialState);
		expect(state).toEqual(loginDetails);
	});

	it.each([undefined, []])('normalises missing or empty roles (%s)', (roles) => {
		expect(userServiceReducer(undefined, Login({ ...loginDetails, roles })).roles).toEqual([]);
	});

	it('removes the full-access role when configured without mutating the login payload', () => {
		environment.RemoveAADFullAccessRole = true;
		const roles = [Roles.Admin, 'TechRecord.View', 'TestResult.View'];
		expect(userServiceReducer(undefined, Login({ ...loginDetails, roles })).roles).toEqual([
			'TechRecord.View',
			'TestResult.View',
		]);
		expect(roles).toEqual([Roles.Admin, 'TechRecord.View', 'TestResult.View']);
	});

	it('preserves the full-access role when filtering is disabled', () => {
		environment.RemoveAADFullAccessRole = false;
		const roles = [Roles.Admin, 'TechRecord.View'];
		expect(userServiceReducer(undefined, Login({ ...loginDetails, roles })).roles).toEqual(roles);
	});

	it('selects all logged-in user details from the feature state', () => {
		const loggedIn = userServiceReducer(undefined, Login(loginDetails));
		const state = { [STORE_FEATURE_USER_KEY]: loggedIn };
		expect(user(state)).toBe(loggedIn);
		expect(name(state)).toBe('Test User');
		expect(userEmail(state)).toBe('test.user@example.com');
		expect(id(state)).toBe('user-1');
		expect(employeeId(state)).toBe('employee-1');
		expect(jobTitle(state)).toBe('Vehicle examiner');
		expect(roles(state)).toEqual(['TechRecord.View', 'TestResult.View']);
	});
});
