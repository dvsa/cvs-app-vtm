import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormGroupFrom<T> = {
	[K in keyof T]: T[K] extends object
		? T[K] extends Array<infer U>
			? FormArray<FormGroup<FormGroupFrom<U>>>
			: FormGroup<FormGroupFrom<T[K]>>
		: FormControl<T[K]>;
};
