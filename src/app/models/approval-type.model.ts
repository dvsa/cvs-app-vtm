export const APPROVAL_NUMBER_TYPE_REGEX: Record<string, RegExp> = {
	NTA: /^(.+)$/i, // 25
	'IVA - DVSA/NI': /^(.+)$/i, // 25
	IVA: /^(.+)$/i, // 25
	ECTA: /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	NSSTA: /^e(.{2})\*NKS\*(.{6})$/i, // 14
	ECSSTA: /^e(.{2})\*KS(.{2})\/(.{4})\*(.{6})$/i, // 18
	'GB WVTA': /^(.{3})\*(.{4})\/(.{4})\*(.{7})$/i, // 21
	'UKNI WVTA': /^(.{1})11\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	'EU WVTA Pre 23': /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	'EU WVTA 23 on': /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	QNIG: /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	'Prov.GB WVTA': /^(.{3})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
	'Small series NKSXX': /^(.?)11\*NKS(.{0,2})\/(.{0,4})\*(.{0,6})$/i, // 25
	'Small series NKS': /^(.?)11\*NKS\*(.{0,6})$/i, // 23
	'IVA - VCA': /^n11\*NIV(.{2})\/(.{4})\*(.{6})$/i, // 19
};

export const APPROVAL_TYPE_NUMBER_REGEX_PARTIAL_MATCH: Record<string, RegExp> = {
	NTA: /^(.+)$/i,
	'IVA - DVSA/NI': /^(.+)$/i,
	IVA: /^(.+)$/i,
	ECTA: /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	NSSTA: /^e(.{0,2})\*NKS\*(.{0,6})$/i,
	ECSSTA: /^e(.{0,2})\*KS(.{0,2})\/(.{0,4})\*(.{0,6})$/i,
	'GB WVTA': /^(.{0,3})\*(.{0,4})\/(.{0,4})\*(.{0,7})$/i,
	'UKNI WVTA': /^(.?)11\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	'EU WVTA Pre 23': /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	'EU WVTA 23 on': /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	QNIG: /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	'Prov.GB WVTA': /^(.{0,3})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
	'Small series NKSXX': /^(.?)11\*NKS(.{0,2})\/(.{0,4})\*(.{0,6})$/i, // 25
	'Small series NKS': /^(.?)11\*NKS\*(.{0,6})$/i, // 23
	'IVA - VCA': /^n11\*NIV(.{0,2})\/(.{0,4})\*(.{0,6})$/i,
};

export const APPROVAL_TYPE_NUMBER_REGEX_GENERIC_PARTIAL_MATCH: Record<string, RegExp> = {
	NTA: /^(.+)$/i,
	'IVA - DVSA/NI': /^(.+)$/i,
	IVA: /^(.+)$/i,
	ECTA: /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
	NSSTA: /^(.{0,2})(.{0,6})$/i,
	ECSSTA: /^(.{0,2})(.{0,2})(.{0,4})(.{0,6})$/i,
	'GB WVTA': /^(.{0,3})(.{0,4})(.{0,4})(.{0,7})$/i,
	'UKNI WVTA': /^(.?)(.{0,4})(.{0,4})(.{0,6})$/i,
	'EU WVTA Pre 23': /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
	'EU WVTA 23 on': /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
	QNIG: /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
	'Prov.GB WVTA': /^(.{0,3})(.{0,4})(.{0,4})(.{0,6})$/i,
	'Small series NKSXX': /^(.?)11\*NKS(.{0,2})\/(.{0,4})\*(.{0,6})$/i, // 25
	'Small series NKS': /^(.?)11\*NKS\*(.{0,6})$/i, // 23
	'IVA - VCA': /^(.{0,2})(.{0,4})(.{0,6})$/i,
};

export const APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT: Record<string, number> = {
	NTA: 25,
	'IVA - DVSA/NI': 25,
	IVA: 25,
	ECTA: 20,
	NSSTA: 14,
	ECSSTA: 18,
	'GB WVTA': 21,
	'UKNI WVTA': 20,
	'EU WVTA Pre 23': 20,
	'EU WVTA 23 on': 20,
	QNIG: 20,
	'Prov.GB WVTA': 20,
	'Small series NKSXX': 25,
	'Small series NKS': 23,
	'IVA - VCA': 19,
};

export const APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT_GENERIC: Record<string, number> = {
	NTA: 25,
	'IVA - DVSA/NI': 25,
	IVA: 25,
	ECTA: 16,
	NSSTA: 8,
	ECSSTA: 14,
	'GB WVTA': 18,
	'UKNI WVTA': 15,
	'EU WVTA Pre 23': 16,
	'EU WVTA 23 on': 16,
	QNIG: 16,
	'Prov.GB WVTA': 17,
	'Small series NKSXX': 25,
	'Small series NKS': 23,
	'IVA - VCA': 12,
};
