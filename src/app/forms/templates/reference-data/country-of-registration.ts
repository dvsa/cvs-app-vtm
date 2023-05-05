import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'countryOfRegistration',
  type: FormNodeTypes.GROUP,
  label: 'Country of Registration',
  children: [
    {
      name: 'resourceKey',
      label: 'Key',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      disabled: true,
      validators: [
        {
          name: ValidatorNames.Required
        }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.Required
        }
      ]
    }
  ]
};

export const templateList = [
  {
    column: 'resourceKey',
    heading: 'Key',
    order: 1
  },
  {
    column: 'description',
    heading: 'Country of Registration',
    order: 2
  }
];

/*

[
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "BRAKES",
    "template": {
      "name": "brakes",
      "type": "group",
      "label": "BRAKES",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "dateTimeStamp",
          "label": "Date-Time",
          "type": "control",
          "editType": "HIDDEN",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "service",
          "label": "Service",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 60
            }
          ]
        },
        {
          "name": "secondary",
          "label": "Secondary",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 60
            }
          ]
        },
        {
          "name": "parking",
          "label": "Parking",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 60
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Brakes",
        "order": 2
      },
      {
        "column": "service",
        "heading": "Service",
        "order": 3
      },
      {
        "column": "secondary",
        "heading": "Secondary",
        "order": 4
      },
      {
        "column": "parking",
        "heading": "Parking",
        "order": 5
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "COUNTRY_OF_REGISTRATION",
    "template": {
      "name": "countryOfRegistraion",
      "type": "group",
      "label": "Country of Registraion",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Country of Registration",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "HGV_MAKE",
    "template": {
      "name": "hGVMake",
      "type": "group",
      "label": "HGV Make",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "HGV Make",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "PSV_MAKE",
    "template": {
      "name": "dtpNumber",
      "type": "group",
      "label": "DTp Numbers",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "dateTimeStamp",
          "label": "Date-Time",
          "type": "control",
          "editType": "HIDDEN",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "dtpNumber",
          "label": "DTp Number",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 6
            }
          ]
        },
        {
          "name": "psvBodyMake",
          "label": "PSV Body Make",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 20
            }
          ]
        },
        {
          "name": "psvBodyType",
          "label": "PSV Body Type",
          "type": "control",
          "editType": "DROPDOWN",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "psvChassisMake",
          "label": "PSV Chassis Make",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 20
            }
          ]
        },
        {
          "name": "psvChassisModel",
          "label": "PSV Chassis Model",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 20
            }
          ]
        },
        {
          "name": "userId",
          "label": "User ID",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "dateTimeStamp",
        "heading": "Date-Time",
        "order": 2
      },
      {
        "column": "dtpNumber",
        "heading": "DTp Number",
        "order": 3
      },
      {
        "column": "psvBodyMake",
        "heading": "PSV Body Make",
        "order": 4
      },
      {
        "column": "psvBodyType",
        "heading": "PSV Body Type",
        "order": 5
      },
      {
        "column": "psvChassisMake",
        "heading": "PSV Chassis Make",
        "order": 6
      },
      {
        "column": "psvChassisModel",
        "heading": "PSV Chassis Model",
        "order": 7
      },
      {
        "column": "userId",
        "heading": "User ID",
        "order": 8
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "REASONS_FOR_ABANDONING_HGV",
    "template": {
      "name": "reasonsForAbandoningHGV",
      "type": "group",
      "label": "Reasons for abandoning - HGV",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Reasons for abandoning",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "REASONS_FOR_ABANDONING_PSV",
    "template": {
      "name": "reasonsForAbandoningPSV",
      "type": "group",
      "label": "Reasons for abandoning - PSV",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Reasons for abandoning",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "REASONS_FOR_ABANDONING_TRL",
    "template": {
      "name": "reasonsForAbandoningTRL",
      "type": "group",
      "label": "Reasons for abandoning - TRL",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Reasons for abandoning",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "SPECIALIST_REASONS_FOR_ABANDONING",
    "template": {
      "name": "reasonsForAbandoningSpecialist",
      "type": "group",
      "label": "Reasons for abandoning - Specialist",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Reasons for abandoning",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "TIR_REASONS_FOR_ABANDONING",
    "template": {
      "name": "reasonsForAbandoningTIR",
      "type": "group",
      "label": "Reasons for abandoning - TIR",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "Reasons for abandoning",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "ReferenceDataType",
    "resourceKey": "TRL_MAKE",
    "template": {
      "name": "tRLMake",
      "type": "group",
      "label": "TRL Make",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "description",
        "heading": "TRL Make",
        "order": 2
      }
    ]
  },
  {
    "resourceType": "REFERENCE_DATA_ADMIN_TYPE",
    "resourceKey": "TYRES",
    "template": {
      "name": "tyres",
      "type": "group",
      "label": "Tyres",
      "children": [
        {
          "name": "resourceKey",
          "label": "Key",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "code",
          "label": "Code",
          "type": "control",
          "editType": "NUMBER",
          "validators": [
            {
              "name": "max",
              "args": 99999
            }
          ]
        },
        {
          "name": "dateTimeStamp",
          "label": "Date-Time",
          "type": "control",
          "editType": "HIDDEN",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "description",
          "label": "Description",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        },
        {
          "name": "loadIndexSingleLoad",
          "label": "Load Index Single",
          "type": "control",
          "editType": "NUMBER",
          "validators": [
            {
              "name": "max",
              "args": 999
            }
          ]
        },
        {
          "name": "loadIndexTwinLoad",
          "label": "Load Index Twin",
          "type": "control",
          "editType": "NUMBER",
          "validators": [
            {
              "name": "max",
              "args": 999
            }
          ]
        },
        {
          "name": "plyRating",
          "label": "Ply rating",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 2
            }
          ]
        },
        {
          "name": "tyreSize",
          "label": "Tyre Size",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "maxLength",
              "args": 12
            }
          ]
        },
        {
          "name": "userId",
          "label": "User ID",
          "type": "control",
          "editType": "TEXT",
          "validators": [
            {
              "name": "required"
            }
          ]
        }
      ]
    },
    "templateList": [
      {
        "column": "resourceKey",
        "heading": "Key",
        "order": 1
      },
      {
        "column": "code",
        "heading": "Code",
        "order": 2
      },
      {
        "column": "dateTimeStamp",
        "heading": "Date-Time",
        "order": 3
      },
      {
        "column": "description",
        "heading": "TRL Make",
        "order": 4
      },
      {
        "column": "loadIndexSingleLoad",
        "heading": "Load Index Single",
        "order": 5
      },
      {
        "column": "loadIndexTwinLoad",
        "heading": "Load Index Twin",
        "order": 6
      },
      {
        "column": "plyRating",
        "heading": "Ply Rating",
        "order": 7
      },
      {
        "column": "tyreSize",
        "heading": "Tyre Size",
        "order": 8
      },
      {
        "column": "userId",
        "heading": "User ID",
        "order": 9
      }
    ]
  }
]

*/
