import { TestType } from './testType';
import { TestTypeCategory } from './testTypeCategory';

export interface TestTypesTaxonomy extends Array<TestType | TestTypeCategory> { 
}