import {Action, combineReducers} from '@ngrx/store';
import {
  AddArrayControlAction,
  addGroupControl,
  createFormStateReducerWithUpdate,
  RemoveArrayControlAction,
  setValue,
  updateGroup,
  validate
} from 'ngrx-forms';
import {greaterThan, lessThanOrEqualTo, maxLength, required} from 'ngrx-forms/validation';
import {adrDetailsFormModel} from '@app/models/adrDetailsForm.model';
import {IAppState, INITIAL_STATE} from '../state/adrDetailsForm.state';
import {
  CreateGuidanceNoteElementAction,
  CreatePermittedDangerousGoodElementAction,
  CreateProductListUnNoElementAction, CreateTc3TypeElementAction,
  RemoveGuidanceNoteElementAction,
  RemovePermittedDangerousGoodElementAction,
  RemoveProductListUnNoElementAction,
  SetSubmittedValueAction
} from '../actions/adrDetailsForm.actions';
import {approvalDate} from '@app/models/approvalDate';

const formGroupReducerWithUpdate = createFormStateReducerWithUpdate<adrDetailsFormModel>(updateGroup<adrDetailsFormModel>({
  name: validate(required, maxLength(150)),
  street: validate(required, maxLength(150)),
  town: validate(required, maxLength(100)),
  city: validate(required, maxLength(100)),
  postcode: validate(required, maxLength(25)),
  type: validate(required),
  approvalDate: updateGroup<approvalDate>({
    day: validate(required, greaterThan(0), lessThanOrEqualTo(31)),
    month: validate(required, greaterThan(0), lessThanOrEqualTo(12)),
    year: validate(required, greaterThan(1970)),
  }),
  permittedDangerousGoods: validate(required),
  additionalNotes: validate(required),
  tankManufacturer: validate(maxLength(70)),
  tankManufacturerSerialNo: validate(maxLength(50)),
  tankTypeAppNo: validate(maxLength(65)),
  tankCode: validate(maxLength(30)),
  statement: validate(maxLength(1500)),
  productList: validate(maxLength(1500)),
  specialProvisions: validate(maxLength(1024)),
  tc2IntermediateApprovalNo: validate(maxLength(75)),
  tc3PeriodicNumber: validate(maxLength(75)),
  memosApply: validate(required),
  batteryListNumber: validate(maxLength(8))

}));


const reducers = combineReducers<IAppState['adrDetails'], any>({
  formState(
    s = INITIAL_STATE,
    a: CreatePermittedDangerousGoodElementAction | RemovePermittedDangerousGoodElementAction |
       CreateGuidanceNoteElementAction | RemoveGuidanceNoteElementAction |
       CreateProductListUnNoElementAction | RemoveProductListUnNoElementAction |
       CreateTc3TypeElementAction
  ) {
    s = formGroupReducerWithUpdate(s, a);

    switch (a.type) {
      case CreatePermittedDangerousGoodElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          permittedDangerousGoods: group => {
            return addGroupControl(group, a.name, false);
          },
        })(s);

      case RemovePermittedDangerousGoodElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          permittedDangerousGoods: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            return setValue(group, newValue);
          },
        })(s);

      case CreateGuidanceNoteElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          additionalNotes: group => {
            return addGroupControl(group, a.name, false);
          },
        })(s);

      case RemoveGuidanceNoteElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          additionalNotes: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            return setValue(group, newValue);
          },
        })(s);


      case CreateProductListUnNoElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          productListUnNo: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            return setValue(group, newValue);
          },
        })(s);

      case RemoveProductListUnNoElementAction.TYPE:
        return updateGroup<adrDetailsFormModel>({
          productListUnNo: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            return setValue(group, newValue);
          },
        })(s);

      default:
        return s;
    }
  },
  permittedDangerousGoodsOptions(
    s: string[] = [],
    a: CreatePermittedDangerousGoodElementAction | RemovePermittedDangerousGoodElementAction
  ) {
    // console.log(`inside reducer permittedDangerousGoodsOptions s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
    switch (a.type) {
      case CreatePermittedDangerousGoodElementAction.TYPE:
        return [...s, a.name];

      case RemovePermittedDangerousGoodElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
  },
  additionalNotesOptions(
    s: string[] = ['Document Option 1', 'Document Option 2'],
    a: CreateGuidanceNoteElementAction | RemoveGuidanceNoteElementAction
  ) {
    // console.log(`inside reducer additionalNotesOptions s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
    switch (a.type) {
      case CreateGuidanceNoteElementAction.TYPE:
        return [...s, a.name];

      case RemoveGuidanceNoteElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
  },
  productListUnNo: function (
    s = {maxIndex: 0, options: []},
    a: AddArrayControlAction<number> | RemoveArrayControlAction,
  ) {
    switch (a.type) {
      case AddArrayControlAction.TYPE: {
        console.log(`inside reducer productListUnNo AddArrayControlAction.TYPE s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
        const maxIndex = s.maxIndex + 1;
        const options = [...s.options];
        options.splice(a.index!, 0, maxIndex);
        return {
          maxIndex,
          options,
        };
      }

      case RemoveArrayControlAction.TYPE: {
        const options = [...s.options];
        options.splice(a.index!, 1);
        return {
          ...s,
          options,
        };
      }

      default:
        return s;
    }
  },
  tc3Type: function (
    s = {maxIndex: 0, options: []},
    a: CreateTc3TypeElementAction,
  ) {
    switch (a.type) {
      case CreateTc3TypeElementAction.TYPE: {
        console.log(`inside reducer tc3Type AddArrayControlAction.TYPE s => ${JSON.stringify(s)}, a => ${JSON.stringify(a)}`);
        const maxIndex = s.maxIndex + 1;
        const options = [...s.options];
        // tslint:disable-next-line:no-unnecessary-type-assertion no-non-null-assertion
        options.splice(a.index!, 0, maxIndex);
        return {
          maxIndex,
          options,
        };
      }

      // case CreateTc3TypeElementAction.TYPE: {
      //   const options = [...s.options];
      //   // tslint:disable-next-line:no-unnecessary-type-assertion no-non-null-assertion
      //   options.splice(a.index!, 1);
      //   return {
      //     ...s,
      //     options,
      //   };
      // }

      default:
        return s;
    }
  },
  submittedValue(s: adrDetailsFormModel | undefined, a: SetSubmittedValueAction) {
    switch (a.type) {
      case SetSubmittedValueAction.TYPE:
        return a.submittedValue;

      default:
        return s;
    }
  },
});


export function adrDetailsReducer(state: IAppState['adrDetails'], action: Action) {
  return reducers(state, action);
}
