export enum EU_VEHICLE_CATEGORY_PSV {
  M2 = 'M2',
  M3 = 'M3'
}

export enum EU_VEHICLE_CATEGORY_HGV {
  N2 = 'N2',
  N3 = 'N3'
}

export enum EU_VEHICLE_CATEGORY_TRL {
  O1 = 'O1',
  O2 = 'O2',
  O3 = 'O3',
  O4 = 'O4'
}

export enum EU_VEHICLE_CATEGORY_CAR {
  M1 = 'M1'
}

export enum EU_VEHICLE_CATEGORY_LGV {
  N1 = 'N1'
}

export enum ODOMETER_READING_UNITS {
  KM = 'kilometres',
  MILES = 'miles'
}

export enum EMISSION_STANDARD {
  EMISSION_STANDARD_1 = '0.10 g/kWh Euro 3 PM',
  EMISSION_STANDARD_2 = '0.03 g/kWh Euro IV PM',
  EMISSION_STANDARD_3 = 'Euro 3',
  EMISSION_STANDARD_4 = 'Euro 4',
  EMISSION_STANDARD_5 = 'Euro 6',
  EMISSION_STANDARD_6 = 'Euro VI',
  EMISSION_STANDARD_7 = 'Full Electric'
}

export enum FUEL_TYPE {
  FUEL_TYPE_1 = 'Diesel',
  FUEL_TYPE_2 = 'Gas-cng',
  FUEL_TYPE_3 = 'Gas-lng',
  FUEL_TYPE_4 = 'Gas-lpg',
  FUEL_TYPE_5 = 'Fuel cell',
  FUEL_TYPE_6 = 'Petrol',
  FUEL_TYPE_7 = 'Full electric'
}

export enum MOD_TYPE {
  MOD_TYPE_1 = 'P - Particulate trap',
  MOD_TYPE_2 = 'M - Modification or change of engine',
  MOD_TYPE_3 = 'G - Gas engine'
}

export enum TEST_STATION_TYPE {
  ATF = 'ATF',
  GVTS = 'GVTS',
  HQ = 'HQ'
}

export enum RESULT {
  FAIL = 'Fail',
  PASS = 'Pass',
  PRS = 'PRS',
  ABANDONED = 'Abandoned'
}

export enum REASON_FOR_ABANDONING_PSV {
  R1 = 'The vehicle was not submitted for test at the appointed time',
  R2 = 'The relevant test fee has not been paid',
  R3 = 'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle',
  R4 = 'The registration document or other evidence of the date of first registration was not presented when requested',
  R5 = 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out',
  R6 = 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
  R7 = 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
  R8 = 'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible',
  R9 = 'Current Health and Safety legislation cannot be met in testing the vehicle',
  R10 = 'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination' +
    'or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so',
  R11 = 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted',
  R12 = 'A proper examination cannot be readily carried out as any door engine cover hatch or other access device designed to be opened is locked or otherwise cannot be opened'
}

export enum REASON_FOR_ABANDONING_HGV_TRL {
  R1 = 'The vehicle was not submitted for test at the appointed time',
  R2 = 'The relevant test fee has not been paid',
  R3 = 'The trailer was not accompanied by a suitable motor vehicle',
  R4 = 'There is not permanently fixed to the chassis serial number as shown on the registration document (motor vehicle) or the identification' +
    'mark issued by the Secretary of State (trailer)',
  R5 = 'A Ministry Plate has been issued and is not fitted to the vehicle or trailer',
  R6 = 'The particulars of the motor vehicle or trailer (e.g. number of axles / axle weights) do not match the VTG6 Ministry Plate fitted to the vehicle',
  R7 = 'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
  R8 = 'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
  R9 = 'No proof was given that the vehicle used for carrying dangerous/toxic/corrosive or inflammable goods had been cleaned or otherwise rendered safe for test',
  R10 = 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
  R11 = 'The vehicle was not loaded as required',
  R12 = 'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
  R13 = 'The vehicle was presented for test carrying livestock or other unsuitable material',
  R14 = 'Current Health and Safety legislation cannot be met in testing the vehicle',
  R15 = 'The vehicle exhaust outlet has been modified preventing a metered smoke check',
  R16 = 'The examiner could not open the tachograph',
  R17 = 'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test'
}

export enum REASON_FOR_ABANDONING_TIR {
  R1 = 'The vehicle was not submitted for test at the appointed time',
  R2 = 'The relevant test fee has not been paid',
  R3 = 'The trailer was not accompanied by a suitable drawing motor vehicle',
  R4 = 'There is not permanently fixed to the chassis a serial number (motor vehicle) or the identification mark issued by the Secretary of State (trailer)',
  R5 = 'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
  R6 = 'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
  R7 = 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
  R8 = 'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
  R9 = 'The vehicle was presented for test carrying unsuitable material',
  R10 = 'Current Health and Safety legislation cannot be met in testing the vehicle',
  R11 = 'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test'
}
