// Clear MSAL interaction state when stuck in "interaction_in_progress"
export function resetMsalState(): void {
	try {
		// Clear MSAL's interaction state from localStorage
		const keys = Object.keys(localStorage);
		keys.forEach((key) => {
			if (
				key.includes('interaction') ||
				key.includes('msal') ||
				key.includes('AuthenticationRequest')
			) {
				localStorage.removeItem(key);
			}
		});

		// Clear from sessionStorage too
		const sessionKeys = Object.keys(sessionStorage);
		sessionKeys.forEach((key) => {
			if (key.includes('msal') || key.includes('interaction')) {
				sessionStorage.removeItem(key);
			}
		});

		console.log('MSAL state cleared');
	} catch (err) {
		console.error('Failed to reset MSAL state:', err);
	}
}
