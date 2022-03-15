import { VehicleTechRecordModel } from '../app/models/vehicle-tech-record.model';

export default <unknown> {
  systemNumber: "11000001",
  techRecord: [
    {
          bodyType: {
              description: "single decker",
              code: "s"
          },
          grossKerbWeight: 9140,
          brakeCode: "135202",
          lastUpdatedAt: "2018-10-01T00:00:00.027Z",
          coifDate: "2008-04-23",
          seatsUpperDeck: 0,
          vehicleSubclass: [
              "string"
          ],
          standingCapacity: 26,
          brakes: {
              brakeCodeOriginal: "123",
              brakeCode: "135202",
              retarderBrakeOne: "hydraulic",
              brakeForceWheelsNotLocked: {
                  parkingBrakeForceA: 2163,
                  serviceBrakeForceA: 6084,
                  secondaryBrakeForceA: 3042
              },
              dataTrBrakeTwo: "None",
              retarderBrakeTwo: "hydraulic",
              dataTrBrakeOne: "None",
              dataTrBrakeThree: "None",
              brakeForceWheelsUpToHalfLocked: {
                  secondaryBrakeForceB: 2285,
                  parkingBrakeForceB: 1462,
                  serviceBrakeForceB: 4570
              }
          },
          bodyModel: "Centro",
          bodyMake: "Plaxton",
          conversionRefNo: "1",
          grossLadenWeight: 13520,
          axles: [
              {
                  axleNumber: 1,
                  tyres: {
                      tyreSize: "265/70-19.5",
                      speedCategorySymbol: "m",
                      fitmentCode: "single",
                      dataTrAxles: 0,
                      plyRating: "A",
                      tyreCode: 735
                  },
                  parkingBrakeMrk: false,
                  weights: {
                      kerbWeight: 2760,
                      gbWeight: 5000,
                      ladenWeight: 0,
                      designWeight: 5000
                  }
              },
              {
                  axleNumber: 2,
                  weights: {
                      kerbWeight: 6380,
                      gbWeight: 9440,
                      ladenWeight: 0,
                      designWeight: 9440
                  },
                  tyres: {
                      tyreSize: "265/70-19.5",
                      speedCategorySymbol: "m",
                      fitmentCode: "double",
                      dataTrAxles: 0,
                      plyRating: "A",
                      tyreCode: 733
                  }
              }
          ],
          createdAt: "2018-04-20T04:20:00.027Z",
          chassisModel: "SB200",
          grossGbWeight: 14440,
          dispensations: "None",
          vehicleClass: {
              description: "small psv (ie: less than or equal to 22 seats)",
              code: "s"
          },
          chassisMake: "DAF",
          vehicleSize: "small",
          noOfAxles: 2,
          grossDesignWeight: 14440,
          vehicleType: "psv",
          speedLimiterMrk: false,
          recordCompleteness: "complete",
          vehicleConfiguration: "rigid",
          seatsLowerDeck: 22,
          tachoExemptMrk: true,
          unladenWeight: 0,
          ntaNumber: "1",
          reasonForCreation: "COIF",
          euVehicleCategory: "m2",
          speedRestriction: 0,
          manufactureYear: 2008,
          remarks: "OUTSWING 120MM. 45 & 26 OR 42 SEATS & 1 WHEELCHAIR WITH 26 STANDEES. DDA SCHEDULES 1 & 2. SEAT BELTS FITTED TO ALL FORWARD FACING SEATS 3 POINT 42 IN TOTAL INC DRIVER.",
          statusCode: "current",
          numberOfWheelsDriven: null
      }
  ],
  vin: "XMGDE02FS0H012345",
  trailerId: "09876543",
  vrms: [
      {
          vrm: "JY58FPP",
          isPrimary: true
      },
      {
          vrm: "609859Z",
          isPrimary: false
      }
  ],
  metadata: {
      makeAndChassisMakeFe: [
          "A FARLOW ENGINEERING LTD",
          "A HINGLEY",
          "A MORAIS AND CA LTD",
          "A SILVA MATOS",
          "A&R",
          "A1 INTERNATIONAL",
          "AAA",
          "AARON",
          "ABBEY",
          "ABEL SYSTEMS LTD",
          "ABM TRAILERS",
          "ABTS",
          "ACE",
          "ACHILEITNER",
          "ACKERMANN-FRUEHAUF",
          "ACOTE BOON",
          "ACTM",
          "ACTOMEX",
          "ADAMOLI",
          "ADCLIFFE",
          "ADL",
          "AE WILSON",
          "AEC",
          "AGA",
          "AGRIMAC",
          "AHC",
          "AHG",
          "AHP",
          "AHT",
          "AIR PRODUCTS",
          "AKSOYLU",
          "AL-KO KOBER",
          "ALBION",
          "ALEX PRICE",
          "ALEXANDER",
          "ALEXANDER/DENNIS",
          "ALFA ROMEO",
          "ALHU",
          "ALIWELD LTD",
          "ALKO",
          "ALLAN FULLER LTD",
          "ALTHAM",
          "ALUMINIOS CASTELLANO MANCHEGOS",
          "ALUVAN",
          "AMERICAN LE FRANCE",
          "AMH",
          "AMT",
          "ANCO",
          "ANDOVER",
          "ANKAI",
          "APRILIA",
          "ARB",
          "ARCERBI",
          "ARDAGH",
          "ARGYLE",
          "ARJ TRAILERS",
          "ARMSTRONG & HOYLE",
          "ARTIC",
          "ASCENDANT",
          "ASCHE",
          "ASCHERSLEBEN",
          "ASHCROFT",
          "ASTA",
          "ASTON MARTIN",
          "ATHY",
          "ATLAS",
          "ATTACUS",
          "AUDI",
          "AUGUST SCHMIDT - HAGAN",
          "AUSTIN",
          "AUTO GALANTAS",
          "AUTOSAN",
          "AVALUX",
          "AVIA",
          "AVONDALE",
          "AWD",
          "AYATS",
          "B.PRORAIL",
          "B12K",
          "BACKERS",
          "BAILEY",
          "BALE",
          "BALE FABRICATIONS",
          "BANNAS",
          "BARREIRO",
          "BARRUS",
          "BARTOLETTI",
          "BARUVAL",
          "BARVICK",
          "BARYVAL",
          "BASCON",
          "BASCONTRIZ",
          "BATESON",
          "BBC",
          "BCI",
          "BEATEX",
          "BEATSON",
          "BEDFORD",
          "BEDFORD/MARSHALL",
          "BEE",
          "BEECHWOOD",
          "BELLE",
          "BELLE COACHWORKS",
          "BEN COOPER",
          "BENALU",
          "BENCE",
          "BENELLI",
          "BENNINGHOVEN",
          "BENTLEY",
          "BERDEX",
          "BERGER",
          "BESPOKE",
          "BICKERS TRAILER",
          "BINGLEY BOAT",
          "BISCHOFF",
          "BIZIEN",
          "BKF3.15",
          "BLACKBURN",
          "BLACKMORE",
          "BLACKSTONE",
          "BLACKWATER",
          "BLUEBIRD",
          "BLUEHARDT",
          "BLUELINE",
          "BMC",
          "BMI TRAILER",
          "BMMO",
          "BMW",
          "BOALLOY",
          "BOC CRYOPLANT",
          "BODEN",
          "BOERNER WILDESHAUSEM",
          "BOMBARDIER",
          "BONALLACK",
          "BONIFACE",
          "BOOTH",
          "BOUGHTON ENGINEERING LTD",
          "BOVA",
          "BOXLOADER",
          "BPW",
          "BRAMBER",
          "BREINING",
          "BREMACH",
          "BREMAT",
          "BRENDECK",
          "BRIAB",
          "BRIAN JAMES",
          "BRIDGE",
          "BRIDGE BODIES",
          "BRISTOL",
          "BRITCOM INTERNATIONAL",
          "BROCKHOUSE",
          "BROOKLAND SPEED",
          "BROOKSIDE ENG",
          "BROSHUIS",
          "BROUGHAN",
          "BRUCE COOK",
          "BSL",
          "BSLT",
          "BT TRAILERS",
          "BTC",
          "BTS",
          "BUCA",
          "BUCHER",
          "BUCKSTONE GROUP",
          "BUELL",
          "BULK WASTE TRAILER",
          "BULTHUIS",
          "BURG",
          "BURGERS",
          "BUTTERFIELD",
          "BYD",
          "CALDAL",
          "CAMEO",
          "CAMERON",
          "CAMPBELL",
          "CANNON",
          "CARAVANAS RIOJA",
          "CARDI",
          "CARMICHAEL",
          "CAT",
          "CB",
          "CB COTTINGHAM",
          "CCFC",
          "CF",
          "CHARGE",
          "CHASSIS DEVELOPMENT LTD",
          "CHEREAU",
          "CHEVROLET",
          "CHRYSLER",
          "CITROEN",
          "CLAYTON",
          "COLT",
          "COMET",
          "COMMER",
          "COMPASS",
          "COUNTY TRACTORS",
          "CRANE FRUEHAUF",
          "CRAVEN TASKER",
          "CROMPTON",
          "CROSSLEY",
          "CSEPEL",
          "CVB LTD",
          "CVE",
          "DAEWOO",
          "DAF",
          "DAIMLER",
          "DENNIS",
          "DENNIS/TRANSBUS",
          "DENNISON",
          "DESIGNLINE",
          "DEVAN",
          "DIAHATSU",
          "DODGE",
          "DON BUR",
          "DROGMOLLER",
          "DUCATI",
          "DUPLE",
          "DUPLE/PLAXTON",
          "EBRO",
          "ELDDIS",
          "ENASA PEGASA",
          "ENTERPRISE BUS LTD",
          "ERF",
          "ESTEPE",
          "EUROBUS(UK) LTD",
          "EVOBUS",
          "FAW",
          "FERRARI",
          "FIAT",
          "FLEUR DE LYS",
          "FODEN",
          "FORD",
          "FORD TRANSIT",
          "FREIGHT ROVER",
          "FREIGHTLINER",
          "FUSO",
          "GAC",
          "GENERAL MOTORS",
          "GENERAL TRAILERS",
          "GMC",
          "GRAFTON",
          "GRANNING",
          "GRAY & ADAMS",
          "GUY",
          "HAGGLUND",
          "HARLEY DAVIDSON",
          "HIGER",
          "HINO",
          "HOME BUILT",
          "HONDA",
          "HOYNER",
          "HUMMER",
          "HYUNDAI",
          "IFA MOTOREN",
          "IFOR WILLIAMS",
          "IKARUS",
          "INTER LOAD STAR",
          "INTERNATIONAL",
          "IRISBUS",
          "IRIZAR",
          "ISUZU",
          "IVECO",
          "JAGUAR",
          "JCB",
          "JEEP",
          "JOHN DEERE",
          "JOHNSTON",
          "JONCKHEERE",
          "JSH",
          "KASSBOHRER",
          "KAWASAKI",
          "KENWORTH",
          "KIA",
          "KING LONG",
          "KIRN",
          "KOGEL",
          "KRONE",
          "LAG",
          "LAMBERET",
          "LANCIA",
          "LANDROVER",
          "LAVERDA",
          "LDV",
          "LEYLAND",
          "LOHR",
          "LOTUS",
          "LTI",
          "LYNTON",
          "M & G",
          "MACK",
          "MAGIRUS",
          "MAGIRUS DEUTZ",
          "MAN",
          "MARBUS",
          "MASARATI",
          "MASSEY",
          "MASSEY FERGUSON",
          "MATBRO",
          "MATHIEU",
          "MAZDA",
          "MCW",
          "MERCEDES BENZ",
          "METROCAB",
          "MG",
          "MITSUBISHI",
          "MOL",
          "MONTENEGRO",
          "MONTRACON",
          "MORGAN",
          "MORRIS",
          "MORRISON",
          "MOSELEY",
          "MOTO GUZZI",
          "MOWAG",
          "MULTICAR",
          "MV AGUSTA",
          "NEOMAN",
          "NEOPLAN",
          "NISSAN",
          "NOOTEBOOM",
          "NORTON",
          "OMNIBUS",
          "OMNINOVA",
          "OPTARE",
          "OTOKAR",
          "PETERBILT",
          "PEUGEOT",
          "PINZGAUER",
          "PLASTISOL",
          "PLAXTON",
          "PORSCHE",
          "PROTON\tN",
          "QUEST",
          "RANGE ROVER",
          "RAVO",
          "RENAULT",
          "REYONOLDS BOUGHTON",
          "ROBERTS LEYLAND",
          "ROLLS ROYCE",
          "ROVER",
          "ROYAL ENFIELD",
          "SAAB",
          "SALVADOR CAETENO",
          "SANOS",
          "SCAMMELL",
          "SCANIA",
          "SCHMITZ",
          "SCHORLING",
          "SCHWARZMULLER",
          "SDC",
          "SEAT",
          "SEDDON",
          "SEDDON ATKINSON",
          "SENTINEL",
          "SETRA",
          "SEV",
          "SHELVOKE & DREWRY",
          "SINOTRUK",
          "SKODA",
          "SOLBUS",
          "SPARTAN",
          "STANDARD",
          "STERLING",
          "STEYR",
          "SUBARU",
          "SUPACAT",
          "SUZUKI",
          "SWIFT",
          "TALBOT",
          "TAM",
          "TATA",
          "TATRA",
          "TAZ",
          "TBI",
          "TECHNOBUS",
          "TEMSA",
          "TERBERG",
          "TESTING",
          "TILLING STEVENS",
          "TIRSAN",
          "TOYOTA",
          "TRIUMPH",
          "TROJAN",
          "TSE",
          "TVAC",
          "TVR",
          "UNIC IVECO",
          "UNVI",
          "URAL",
          "VAN HOOL",
          "VAUXHALL",
          "VDL",
          "VESPA",
          "VOLKSWAGEN",
          "VOLVO",
          "WARD",
          "WEIGHTLIFTER",
          "WESTERN STAR",
          "WHITE",
          "WIERDA VOERTUIG TECKNIEK",
          "WILSON",
          "WRIGHTBUS",
          "YAMAHA",
          "YORK",
          "YUTONG",
          "ZASTAVA",
          "ZETOR"
      ],
      bodyMakeFe: [
          "3C15AB",
          "A LINE",
          "A M C",
          "A-LINE",
          "A1 EXPRESS TRAVEL",
          "A1 QUALITY",
          "A2B",
          "ABC",
          "ABSOLUTE STYLE LIMO",
          "ADAMSON",
          "ADL",
          "ADVANCED",
          "ADVANCED KFS SPECIAL VEHICLES LTD",
          "AFJ",
          "AIRE TRUCK BODIES",
          "AIRPORT EXPRESS",
          "AITKEN",
          "AJOKKI",
          "ALADIN COACHBUILDERS",
          "ALEXANDER",
          "ALEXANDER BUS",
          "ALEXANDER/DENNIS",
          "ALEXANDER/TRANSBUS",
          "ALLIED VEHICLES LTD",
          "ALPHATEC CONVERSIONS",
          "ALTAS",
          "AMC",
          "AMF BRUNS",
          "ANGLO AMERICAN",
          "ANKAI 3 AXLE",
          "APOLLO/ZODIAC",
          "APPLEBY HERITAGE CEN",
          "ARNOLD CLARK",
          "ARSET TUNING DIZAYN",
          "ASCO",
          "ASQUITH",
          "ASSURANCE",
          "ATLAS",
          "ATT PAPWORTH",
          "AUSTIN MORRIS",
          "AUTO CUBY",
          "AUTOBUS",
          "AUTOBUS CLASSIQUE",
          "AUTOCHECK",
          "AUTOKORI",
          "AUTOSAN",
          "AUTOTRIM",
          "AUTOTRIM SPEC SERV",
          "AVIA",
          "AVONDALE",
          "AYATS",
          "BAILEY",
          "BALMORAL/N W C SALES",
          "BARBI",
          "BARIRAN",
          "BARNABY",
          "BARNARD",
          "BAV",
          "BCI",
          "BEADLE",
          "BEARWOOD",
          "BEAULAS",
          "BEDFORD COACHWORKS",
          "BEDWAS",
          "BELTON COMMERCIALS",
          "BENTLEYS",
          "BERKHOF",
          "BERNARD MANSELL",
          "BEULAS",
          "BHX",
          "BJ CONVERSIONS",
          "BJS",
          "BLUEBIRD",
          "BMC",
          "BMMO",
          "BOVA",
          "BRADSHAWS",
          "BRECON COACHWORKS",
          "BRECON COMMERCIAL SA",
          "BRISTOL",
          "BROUGHTON",
          "BROXWOOD",
          "BRUSH",
          "BUILD A VAN",
          "BURLINGHAM",
          "BURNETT",
          "BUS/TRAM",
          "BUSCONCEPT",
          "BUSCRAFT",
          "BYD",
          "C & G COACHBUILDERS",
          "C J CONVERSIONS",
          "C S M",
          "CACCIAMALI",
          "CAETANO",
          "CALLA COACH",
          "CAMO",
          "CAR BUS",
          "CAR CHAIR",
          "CAR.IND",
          "CARCROFT",
          "CARDIFF COMMERCIALS",
          "CARELINE",
          "CARLYLE",
          "CARMICHAEL",
          "CARRIER",
          "CARROSSERIE",
          "CARRY DUFF",
          "CARTWRIGHT",
          "CASTLE",
          "CASTROSUA",
          "CENTAUR",
          "CENTO BUS",
          "CENTRAL",
          "CENTRAL SCOTLAND",
          "CENTRAL/W J W CONV",
          "CENTRAL/WALSALL",
          "CHARLES WARNER",
          "CHARTERWAY",
          "CHASSIS DEVELOPMENTS",
          "CHESHIRE CONTINENTAL",
          "CHESHIRE VEHICLE CONVERSIONS LTD",
          "CHORLEY COACHCRAFT",
          "CHRYSTAL",
          "CHURCHILL",
          "CITROEN",
          "CJ CONVERSIONS",
          "CLASSIC COACHBUILDER",
          "CLYDEHOLME",
          "COACH EUROPE",
          "COACHCRAFT",
          "COACHLINERS",
          "COACHSMITH",
          "COACHTEC",
          "COACHWORK CONVERSION",
          "COACHWORK WALKER",
          "COASTAL COACHBUILDER",
          "COBUS",
          "COGENT",
          "COLCHRI",
          "COLEMAN MILNE",
          "COLIN GODDARD",
          "COLLET S.A",
          "COLMAN MILNE",
          "COLMART",
          "COMMERCIAL SERVICES",
          "COMPLETE VEHICLE CON",
          "CONCEPT",
          "CONSTABLES",
          "CONVERSION",
          "CORPORATE CONVERSION",
          "CORROSSERIE",
          "COTRIM",
          "COURTSIDE",
          "CRAFTSMAN",
          "CRAVENS",
          "CREST",
          "CROSSLEY",
          "CROWN CONVERSIONS LTD",
          "CROWN COACHBUILDERS",
          "CRYSTAL",
          "CSM",
          "CUBY",
          "CUNLIFFE",
          "CUSTOMLINE",
          "CVE",
          "CYMRIC",
          "D & D COACHWORKS",
          "D A MOTOR FITTINGS",
          "D J LIMOS",
          "D WRIGHT",
          "DAB/ECW",
          "DAIMLER",
          "DANESCROFT",
          "DARWIN/EAST LANCS",
          "DAVID FISHWICK",
          "DEACON TRUCK & TRAIL",
          "DEANSGATE",
          "DENNIS",
          "DEPENABLE",
          "DEREK WRIGHT",
          "DERWENT",
          "DESIGNLINE",
          "DEVCO PLAN",
          "DEVON",
          "DJ LIMOS",
          "DODGE",
          "DODSON",
          "DONCASTER TRADE COM",
          "DONNELLYS",
          "DORMOBILE",
          "DRIVELINE LTD",
          "DROGMOLLER",
          "DUPLE",
          "E FARRAR",
          "EAST LANCS",
          "ECB",
          "ECC",
          "ECONOMY",
          "ECW",
          "ELITE",
          "ELME",
          "EMPIRE COACH BUILDER",
          "ENSIGN",
          "ENTERPRISE",
          "ENVIRO 400",
          "ERDUMAN",
          "ERNST AUWARTER",
          "ERUDMAN",
          "ESSBEE",
          "EURO",
          "EUROCOACH BUILDERS",
          "EUROMOTIVE",
          "EUROPA",
          "EUROPA/AUTOBUS",
          "EUROPEAN COACH CONV",
          "EVM",
          "EVOBUS",
          "EXCEL",
          "EXECUTIVE COACHBUILD",
          "EXPERT SVO LTD",
          "EXTREME COACHBUILDER",
          "F G AIRCRAFT",
          "F GUY",
          "FAREBUS",
          "FAST CARRIER",
          "FERGUSON",
          "FERN GROVE",
          "FERQUI",
          "FIAT",
          "FISHWICK",
          "FLEET FINISH",
          "FLEUR DE LYS",
          "FORD",
          "FOWLER",
          "FRANK GUY",
          "FREEBURG",
          "FREIGHT ROVER",
          "G C SMITH",
          "G.M. BILLINGS",
          "GAC",
          "GALAXY COACHBUILDERS",
          "GENETIC ENGINEERING",
          "GIUGIARO",
          "GLENEAGLES CONVERSIONS",
          "GM COACHWORK",
          "GNC",
          "GOLDENSTAND",
          "GOWRINGS MOBILITY",
          "GRAY & ADAMS",
          "GREBE",
          "GREBE COACHES",
          "GREEN MOUNTAIN TRAVE",
          "GROSVENOR",
          "GUY",
          "GWENT VEHICLE REPAIR",
          "H W PICKRELL",
          "HAMBLE MOTORS",
          "HARRINGTON",
          "HARRISONS",
          "HARRURS HORSEBOXES",
          "HARWIN",
          "HARWIN/IMPERIAL",
          "HAWSON GARNER",
          "HAYES & WARD",
          "HEGGIE",
          "HERBERT LOMAS",
          "HIGER",
          "HISPANO CARROCERA",
          "HKS",
          "HOLDSWORTH",
          "HOLLOWAY",
          "HORSEMAN COACHES LTD",
          "HOUSTON COACHWORKS",
          "HOUSTON RAMM",
          "HOWLETTS",
          "HTI",
          "IKARUS",
          "ILES AUTOMOTIVE",
          "IMPERIAL",
          "INDCAR",
          "IRISBUS",
          "IRIZAR",
          "IRMAOS MOTA",
          "IVECO",
          "J R SELBY COACHWORKS",
          "JACOBS",
          "JAYCAS",
          "JCP",
          "JDC ABILITY",
          "JMD",
          "JMD SCOTLAND LTD",
          "JOHN DENNIS",
          "JONCKHEERE",
          "JUBILEE",
          "K & I LTD",
          "K C MOBILITY",
          "K J LUFF COACHBUILDERS",
          "KASSBOHRER",
          "KCC TRANSPORT ENG",
          "KEILLOR",
          "KEN ROSEBURY",
          "KENNING",
          "KFS",
          "KIERMATI",
          "KILBEGGAN",
          "KINETIC",
          "KING LONG",
          "KIRKHAM",
          "KISKIDALE",
          "KOCH",
          "KRYSTAL COACHBUILDER",
          "KUSTERS",
          "KVC",
          "KYS EXECUTIVE TRAVEL",
          "L C B",
          "LA CUSTOM COACHBUILD",
          "LAG",
          "LAMBOURNE",
          "LAN WINDOWS",
          "LANDROVER",
          "LCB",
          "LDV",
          "LEAMAN",
          "LEICESTER CARRIAGE BUILDERS",
          "LEO ENGINEERING",
          "LEX",
          "LEYLAND",
          "LEYLAND DAF",
          "LEYLAND TS6",
          "LHE",
          "LIMO STYLE",
          "LIMOTRACK CONVERSION",
          "LITO",
          "LOCOMOTORS",
          "LOMAS",
          "LONDON PASS TRAN BUS",
          "LONGWELL GREEN",
          "LONSDALE",
          "LPD",
          "LPD/VAUXHALL",
          "LUMIRBUS",
          "LUTON",
          "LVD",
          "LYNDON SYSTEMS",
          "M & M",
          "M/SEX M/CARAVANS LTD",
          "MACEDONIAN COACH IND",
          "MACNEILLIE",
          "MADE TO MEASURE",
          "MAN",
          "MANN EGERTON",
          "MARBUS",
          "MARCOPOLO",
          "MARKS SPECIALISED TRANSPORT",
          "MARSHALL",
          "MARTIN WALKER",
          "MARTIN WALTER",
          "MASSEY",
          "MAXETA",
          "MAYFLOWER",
          "MAZDA",
          "MCELMEEL",
          "MCI",
          "MCLAY",
          "MCREILY",
          "MCV",
          "MCW",
          "MEDIO BYEVOBUS GERMA",
          "MELLOR COACHCRAFT",
          "MERCEDES",
          "MIDLAND COACH CONCEPTS",
          "MIDLAND MOTOR OMNIBUS",
          "MIDLAND RED",
          "MINIBUS OPTIONS",
          "MINIBUS WORLD",
          "MINITRAM",
          "MOBIPEOPLE",
          "MONTANO",
          "MOONLIGHT COACHBUILD",
          "MORESTYLE",
          "MORLEY",
          "MOSELEY",
          "MOTOR-CURE",
          "MOTORCRAFT",
          "MOUNT TAXIS AGENCY",
          "MTR BODIES STRETFORD",
          "MULLINER",
          "MUNRO",
          "MUSSA & GRAZIANO",
          "N WEST COACH SALES",
          "N'HERN COUNT/PLAXTON",
          "NEATH COACHBUILDERS",
          "NEATH COUNCIL",
          "NEEPSEND",
          "NEOBUS",
          "NEOPLAN",
          "NESMO",
          "NESMORE TRUCK BODIES",
          "NEWBERRY COACH BLDRS",
          "NISSAN",
          "NOGE",
          "NOONE TURAS",
          "NORTHERN COUNTIES",
          "NORWICH COACHWORKS",
          "NOVA COACHBUILDERS",
          "NTH WSTRN COACHCRAFT",
          "NU TRACK",
          "O'KELLY",
          "OATIA",
          "OCLAP",
          "OLYMPUS",
          "OMNINOVA",
          "ONYX",
          "OPTARE",
          "OPTARE UK LTD/DARWEN",
          "OPTARE/MCW",
          "OTOKAR",
          "OUGHTRED & HARRISON",
          "OVI",
          "P E VAN TECH",
          "P H CONVERSIONS LTD",
          "PADANE",
          "PAMPAS",
          "PANELTEX LTD",
          "PARAMOUNT",
          "PARK ROYAL",
          "PCW",
          "PE VAN TECH",
          "PEARL",
          "PEGASO",
          "PEGASUS LTD",
          "PENNINE",
          "PENTAGON",
          "PEOPLE MOVERS LTD",
          "PEUGEOT",
          "PHOENIX",
          "PICKRELL",
          "PIKE COACHES",
          "PILCHER GREEN",
          "PINNACLE COACH BUILDERS",
          "PIPER MOTORS CONVERS",
          "PIT STOP",
          "PLASTISOL",
          "PLAXTON",
          "PLAXTON/REEVE BURGES",
          "PLAXTON/TRANSBUS",
          "PMT",
          "PORCELLIO 3 AXLE",
          "PPS COMMERCIALS",
          "PREMIER",
          "PRESTON HALL COACHWORKS",
          "PVS",
          "QEK BARNSLEY",
          "QEK GLOBAL SOLUTIONS",
          "QUALITY VEHICLE CONV",
          "QUICKFIT SBS LTD",
          "R BEQUMONT & SON",
          "R W SNEDDON",
          "RAINBOW COACHES LTD",
          "RANSOMES",
          "RDA",
          "RDH",
          "READING",
          "RED KITE",
          "REEVE BURGESS",
          "RENAULT",
          "REPLICA CHARABANC",
          "RESCROFT",
          "ROBERTS OF LLANDUDNO",
          "ROBIN HOOD",
          "ROBSON",
          "ROCKSTAR LOGISTICS",
          "ROE",
          "ROHILL",
          "ROMSEY COACHES",
          "ROOTES",
          "ROOTES MAIDSTONE",
          "ROSEBURY",
          "ROYAL BY VICTOR BUIL",
          "ROYAL COACHBUILDERS",
          "ROYALE",
          "S C COACHCRAFT",
          "S O T BODIES LTD",
          "SAFELINE CONVERSIONS",
          "SAFFLE",
          "SALMOND",
          "SANDALL TRAVEL",
          "SANOS",
          "SAUNDERS ROE",
          "SCANIA",
          "SCOT SEAT DIRECT",
          "SCOTMOBILITY",
          "SCOTT",
          "SCOTTISH AVIATION",
          "SCOTTISH COOPERATIVE",
          "SEDDON",
          "SEM",
          "SHELLER GLOBE",
          "SHORT BROTHERS",
          "SITCAR",
          "SKYLARK 3 AXLE SCH 6",
          "SLS",
          "SMIT",
          "SMITH ELECTRIC VEHIC",
          "SOLBUS",
          "SOT BODIES",
          "SOUTHPORT BEACH BUS",
          "SPARSHATT",
          "SPRINGFIELD COACH BUILDERS",
          "STADCO COVENTRY",
          "STANFORD COACHWORKS",
          "STARLITE LIMO CONV",
          "STEEDRIVE",
          "STEVENTON TRANS SERV",
          "STEWARTS",
          "STRACHAN",
          "SUNSUNDEGUI",
          "SWAINE",
          "SWANSEA COACHWORKS",
          "SWIFT TRAVEL",
          "T & L COMMERCIALS",
          "TALBOT",
          "TAM",
          "TATA HISPANO",
          "TAURUS",
          "TAWE/CYMRIC",
          "TAXI & BUS CON/SIONS",
          "TAZ",
          "TBC CONVERSIONS",
          "TBI",
          "TBP",
          "TECHNOBUS",
          "TEMSA",
          "TIFFANY COACH BUILDE",
          "TOP TRAVEL COACHES",
          "TORTON",
          "TOURISMO",
          "TOYOTA",
          "TRANSBUS",
          "TRANSLOAD",
          "TRAVELINER",
          "TREKA BUS LTD",
          "TRICENTROL",
          "TROJAN",
          "TRUCKSMITH",
          "TURAS",
          "TVAC",
          "TVAC 3 AXLE",
          "UV MODULAR LTD",
          "UGUR KAROSEA",
          "ULTIMATE COACH BUILD",
          "ULTRA COACHBUILDERS",
          "UNICAR",
          "UNIVERSAL",
          "UNVI",
          "UNWIN CLARK",
          "UPHOLSTERY VEHICLE SERVICES LTD",
          "UTIC",
          "UTILABUS",
          "UV MODULAR",
          "UVG",
          "VALID DTP NUMBER",
          "VAN HOOL",
          "VAN ROOIJEN",
          "VAN TECH",
          "VARIOUS 3 AXLE",
          "VAUXHALL",
          "VDL",
          "VEHICLE CONVERSION",
          "VEHICLE CONVERSION L",
          "VEHIXEL",
          "VERVE",
          "VFS",
          "VIC YOUNG",
          "VISA BUS",
          "VLAD SERVICES LTD",
          "VOLKSWAGEN",
          "VOLVO",
          "VOSPER",
          "VOYAGER",
          "W J W CONVERSIONS",
          "W/STRINGER/CAETANO",
          "WADHAM STRINGER",
          "WAGON UNION",
          "WALKER",
          "WALKER GROUP",
          "WALSALL MOTOR BODIES",
          "WARNERBUS",
          "WBS KEILLOR",
          "WENSUM MOTOR CO",
          "WESTWIND COACH BUILD",
          "WEYMANN",
          "WHADAM STRINGER",
          "WHEADON KOLLER",
          "WHEELCHAIR TRAVEL LT",
          "WHF",
          "WHITACRES",
          "WHITSON",
          "WHITTAKER",
          "WILKER UK LTD",
          "WILKES & MEADE",
          "WILLIAMS",
          "WILLOWBROOK",
          "WINDOVER",
          "WJW",
          "WRIGHT TRAVEL",
          "WRIGHTBUS",
          "WRIGHTBUS/WRIGHT",
          "YEATES",
          "YOUNG",
          "YUTONG",
          "ZODIAC"
      ],
      adrDetails: {
          memosApplyFe: [
              "07/09 3mth leak ext"
          ],
          tank: {
              tankStatement: {
                  substancesPermittedFe: [
                      "Substances permitted under the tank code and any special provisions specified in 9 may be carried",
                      "Substances (Class UN number and if necessary packing group and proper shipping name) may be carried"
                  ]
              }
          },
          additionalNotes: {
              guidanceNotesFe: [
                  "New certificate requested"
              ],
              numberFe: [
                  "1",
                  "1A",
                  "2",
                  "3",
                  "V1B",
                  "T1B"
              ]
          },
          permittedDangerousGoodsFe: [
              "FP <61 (FL)",
              "AT",
              "Class 5.1 Hydrogen Peroxide (OX)",
              "MEMU",
              "Carbon Disulphide",
              "Hydrogen",
              "Explosives (type 2)",
              "Explosives (type 3)"
          ],
          vehicleDetails: {
              typeFe: [
                  "Artic tractor",
                  "Rigid box body",
                  "Rigid sheeted load",
                  "Rigid tank",
                  "Rigid skeletal",
                  "Rigid battery",
                  "Full drawbar box body",
                  "Full drawbar sheeted load",
                  "Full drawbar tank",
                  "Full drawbar skeletal",
                  "Full drawbar battery",
                  "Centre axle box body",
                  "Centre axle sheeted load",
                  "Centre axle tank",
                  "Centre axle skeletal",
                  "Centre axle battery",
                  "Semi trailer box body",
                  "Semi trailer sheeted load",
                  "Semi trailer tank",
                  "Semi trailer skeletal",
                  "Semi trailer battery"
              ]
          }
      }
  }
} as VehicleTechRecordModel;

