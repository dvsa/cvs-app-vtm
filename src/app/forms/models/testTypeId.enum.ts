///// Copied from the backend-lambda https://github.com/dvsa/cvs-svc-test-results/blob/3c1ffe344282b5ce918c151a56144b51cbd1c929/src/assets/Enums.ts#L219

// CVSB-10300 - the following constants are based on the grouping of the test-types in the excel "Use_for_dynamic_functionality - CVSB-10298 only" sheet

// tests for PSV - Annual test, Class 6A seatbelt installation check(annual test, first test), Paid/Part paid annual test retest
// Paid/Part paid prohibition clearance(full inspection, retest with certificate), Prohibition clearance(retest with/without class 6A seatbelt)
export const TEST_TYPES_GROUP1: string[] = ['1', '3', '4', '7', '8', '10', '14', '18', '21', '27', '28', '93'];

// tests for PSV - Paid/Part paid prohibition clearance(full/partial/retest without cert)
export const TEST_TYPES_GROUP2: string[] = ['15', '16', '23', '19', '22'];

// 38 through 36 - tests for PSV - Notifiable alteration check, voluntary brake test, voluntary multi check, voluntary speed limiter check
// voluntary smoke test, voluntary headlamp aim test, vitesse 100 replacement, vitesse 100 application, voluntary tempo 100
// 86 through 90 - tests for HGV - voluntary multi-check, voluntary speed limiter check, voluntary smoke and headlamp aim test
// 87 through 85 - tests for HGV and TRL - voluntary shaker plate check, Free/Paid notifiable alteration, voluntary break test
export const TEST_TYPES_GROUP3_4_8: string[] = [
  '38',
  '30',
  '33',
  '34',
  '32',
  '31',
  '100',
  '121',
  '36',
  '86',
  '88',
  '89',
  '90',
  '87',
  '47',
  '48',
  '85'
];

// 56 and 49 - tests for HGV and TRL - Paid TIR retest, TIR test
// 57 - test for TRL - Free TIR retest
export const TEST_TYPES_GROUP5_13: string[] = ['56', '49', '57'];

// 62, 63, 122 - tests for HGV and TRL - Paid/Part paid roadworthiness retest, Voluntary roadworthiness test
// 101, 91 - tests for TRL - Paid roadworthiness retest, Voluntary roadworthiness test
export const TEST_TYPES_GROUP6_11: string[] = ['62', '63', '122', '101', '91'];

// ADR tests for HGV and TRL
export const TEST_TYPES_GROUP7: string[] = ['59', '60', '50'];

// tests for HGV and TRL - Annual tests, First tests, Annual retests, Paid/Part paid prohibition clearance
export const TEST_TYPES_GROUP9_10: string[] = [
  '76',
  '95',
  '94',
  '53',
  '54',
  '65',
  '66',
  '70',
  '79',
  '82',
  '83',
  '41',
  '40',
  '98',
  '99',
  '103',
  '104',
  '67',
  '107',
  '113',
  '116',
  '119',
  '120',
  '199'
];

// tests for TRL - Paid/Part paid prohibition clearance(retest, full inspection, part inspection, without cert)
export const TEST_TYPES_GROUP12_14: string[] = ['117', '108', '109', '110', '114', '71', '72', '73', '77', '80'];

// 39 - LEC with linked test for PSV, 201 - LEC without linked test for PSV, 45 - LEC without linked test for HGV, 44 - LEC with linked test for HGV
export const TEST_TYPES_GROUP15_16: string[] = ['39', '201', '45', '44'];

// CVSB-10372 - the following constants are based on the grouping of the test-types for specialist tests in the excel "specialist test fields mapping"

// Test/Retest - Free/Paid - IVA inspection, MSVA inspection
export const TEST_TYPES_GROUP1_SPEC_TEST: string[] = [
  '125',
  '126',
  '186',
  '187',
  '128',
  '188',
  '189',
  '129',
  '130',
  '133',
  '134',
  '135',
  '136',
  '138',
  '139',
  '140',
  '150',
  '151',
  '158',
  '159',
  '161',
  '192',
  '193',
  '162',
  '194',
  '195',
  '163',
  '166',
  '167',
  '169',
  '170',
  '172',
  '173',
  '181',
  '182'
];

// Test/Retest COIF with annual test, Seatbelt installation check COIF with annual test
export const TEST_TYPES_GROUP2_SPEC_TEST: string[] = ['142', '146', '175', '177'];

// Test/Retest COIF without annual test, Type approved to bus directive COIF, Annex 7 COIF, TILT COIF retest
export const TEST_TYPES_GROUP3_SPEC_TEST: string[] = ['143', '144', '148', '176', '178', '179'];

// Test Seatbelt installation check COIF without annual test
export const TEST_TYPES_GROUP4_SPEC_TEST: string[] = ['147'];

// Test/Retest Normal/Basic voluntary IVA inspection
export const TEST_TYPES_GROUP5_SPEC_TEST: string[] = ['153', '190', '191', '154', '184', '196', '197', '185'];

export const SPECIALIST_TEST_TYPE_IDS: string[] = [
  '125',
  '126',
  '186',
  '187',
  '128',
  '188',
  '189',
  '129',
  '130',
  '133',
  '134',
  '135',
  '136',
  '138',
  '139',
  '140',
  '150',
  '151',
  '158',
  '159',
  '161',
  '192',
  '193',
  '162',
  '194',
  '195',
  '163',
  '166',
  '167',
  '169',
  '170',
  '172',
  '173',
  '181',
  '182',
  '142',
  '146',
  '175',
  '177',
  '143',
  '144',
  '148',
  '176',
  '178',
  '179',
  '147',
  '153',
  '190',
  '191',
  '154',
  '184',
  '196',
  '197',
  '185'
];

export const TEST_TYPES_GROUP1_DESK_BASED_TEST: string[] = ['417', '418'];

export const TEST_TYPES = {
  testTypesGroup1: TEST_TYPES_GROUP1,
  testTypesGroup2: TEST_TYPES_GROUP2,
  testTypesGroup3And4And8: TEST_TYPES_GROUP3_4_8,
  testTypesGroup7: TEST_TYPES_GROUP7,
  testTypesGroup9And10: TEST_TYPES_GROUP9_10,
  testTypesGroup6And11: TEST_TYPES_GROUP6_11,
  testTypesGroup12And14: TEST_TYPES_GROUP12_14,
  testTypesGroup5And13: TEST_TYPES_GROUP5_13,
  testTypesGroup15And16: TEST_TYPES_GROUP15_16,
  testTypesSpecialistGroup1: TEST_TYPES_GROUP1_SPEC_TEST,
  testTypesSpecialistGroup2: TEST_TYPES_GROUP2_SPEC_TEST,
  testTypesSpecialistGroup3: TEST_TYPES_GROUP3_SPEC_TEST,
  testTypesSpecialistGroup4: TEST_TYPES_GROUP4_SPEC_TEST,
  testTypesSpecialistGroup5: TEST_TYPES_GROUP5_SPEC_TEST,
  testTypesDeskBasedGroup1: TEST_TYPES_GROUP1_DESK_BASED_TEST
};
