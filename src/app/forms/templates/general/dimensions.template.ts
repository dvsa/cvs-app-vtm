import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function getDimensionsSection(includeTrailer: boolean = false): FormNode {
  const section: FormNode = {
    name: 'dimensionsSection',
    label: 'Dimensions',
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
      {
        name: 'dimensions',
        value: '',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'length',
            label: 'Length (mm)',
            value: '',
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
          },
          {
            name: 'width',
            label: 'Width (mm)',
            value: '',
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
          },
          {
            name: 'axleSpacing',
            value: '',
            type: FormNodeTypes.GROUP,
            children: [
              {
                name: 'value',
                label: "Axle 'x' to axle 'y' (mm)",
                value: '',
                type: FormNodeTypes.CONTROL,
                viewType: FormNodeViewTypes.STRING
              }
            ]
          }
        ]
      },
      {
        name: 'frontAxleToRearAxle',
        label: 'Front axle to rear axle (mm)',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      }
    ]
  };

  if (includeTrailer) {
    section.children?.push({
      name: 'rearAxleToRearTrl',
      label: 'Rear axle to rear trailer',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    });
  }

  return section;
}

export function getDimensionsMinMaxSection(heading: string, minField: string, maxField: string): FormNode {
  return {
    name: 'thirdDimensionsSection',
    label: heading,
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
      {
        name: minField,
        label: "Minimum (mm)",
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: maxField,
        label: "Maximum (mm)",
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      }
    ]
  };
}
