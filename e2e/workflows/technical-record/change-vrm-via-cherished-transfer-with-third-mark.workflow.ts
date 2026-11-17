import type { PageFactory } from '../../page-objects/page.factory';
import { changeVrmViaCherishedTransfer } from './change-vrm-via-cherished-transfer.workflow';

export async function changeVrmViaCherishedTransferWithThirdMark(
	pages: PageFactory,
	currentVrm: string,
	thirdMark: string
): Promise<void> {
	await changeVrmViaCherishedTransfer(pages, currentVrm, thirdMark);
}
