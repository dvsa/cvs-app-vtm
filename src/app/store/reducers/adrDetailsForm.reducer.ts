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
import {adrDetailsFormModel} from '@app/technical-record/store/adrDetailsForm.model';

import {
  CreateGuidanceNoteElementAction,
  CreatePermittedDangerousGoodElementAction,
  CreateProductListUnNoElementAction,
  CreateTc3PeriodicExpiryDateElementAction,
  CreateTc3PeriodicNumberElementAction,
  CreateTc3TypeElementAction,
  RemoveGuidanceNoteElementAction,
  RemovePermittedDangerousGoodElementAction,
  RemoveProductListUnNoElementAction,
  SetSubmittedValueAction
} from '../actions/adrDetailsForm.actions';
import {approvalDate} from '@app/models/approvalDate';


