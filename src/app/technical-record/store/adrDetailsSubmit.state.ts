export interface IAdrDetailsSubmitState  {
    context: string;
    adrDetailsPayload: any;
    error?: any;
}

export const initialAdrDetailsSubmitState: IAdrDetailsSubmitState = {
    context: null,
    adrDetailsPayload: null,
    error: null
};