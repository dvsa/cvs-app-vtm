import { RouterNavigatedPayload, SerializedRouterStateSnapshot, routerNavigatedAction } from '@ngrx/router-store';
import { globalWarningReducer, initialGlobalWarningState } from '@store/global-warning/global-warning-service.reducers';
import { clearWarning, setWarnings } from '../global-warning.actions';

describe('Global Warning Reducer', () => {
	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};

			const state = globalWarningReducer(initialGlobalWarningState, action);
			expect(state).toBe(initialGlobalWarningState);
		});
	});

	describe('Success action', () => {
		it.each([clearWarning])('should reset the warning state', (actionMethod) => {
			const newState = { ...initialGlobalWarningState, warnings: [] };
			// all props must be supplied here
			const action = actionMethod();
			const state = globalWarningReducer(initialGlobalWarningState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		it.each([routerNavigatedAction])('should reset the warning state', (actionMethod) => {
			const newState = { ...initialGlobalWarningState, warnings: [] };
			// all props must be supplied here
			const action = actionMethod({ payload: <RouterNavigatedPayload<SerializedRouterStateSnapshot>>{} });
			const state = globalWarningReducer(initialGlobalWarningState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('setWarnings', () => {
		it('should replace existing warnings with new ones', () => {
			const newState = { ...initialGlobalWarningState, warnings: [{ warning: 'some warning', anchorLink: '' }] };
			const action = setWarnings({ warnings: [{ warning: 'some warning', anchorLink: '' }] });
			const state = globalWarningReducer(
				{ ...initialGlobalWarningState, warnings: [{ warning: 'old warning', anchorLink: '' }] },
				action
			);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});
});
