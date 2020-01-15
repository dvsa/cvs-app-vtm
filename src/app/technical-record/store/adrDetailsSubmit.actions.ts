import { Action } from '@ngrx/store';

export class SubmitAdrAction implements Action {
    static readonly TYPE = 'adrDetails/SUBMIT_ADR_ACTION';
    readonly type = SubmitAdrAction.TYPE;
    constructor(public submitContext: string) { }
}

export class SubmitAdrActionSuccess implements Action {
    static readonly TYPE = 'adrDetails/SUBMIT_ADR_ACTION_SUCCESS';
    readonly type = SubmitAdrActionSuccess.TYPE;
    constructor(public payload: any) { }
}

export class SubmitAdrActionFailure implements Action {
    static readonly TYPE = 'adrDetails/SUBMIT_ADR_ACTION_FAILURE';
    readonly type = SubmitAdrActionFailure.TYPE;
    constructor(public payload: any) { }
}