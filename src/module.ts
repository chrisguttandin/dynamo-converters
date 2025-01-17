import { createAddValue } from './factories/add-value';
import { createConvertDataArray } from './factories/convert-data-array';
import { createConvertDataObject } from './factories/convert-data-object';
import { createConvertDataValue } from './factories/convert-data-value';
import { createConvertDelta } from './factories/convert-delta';
import { createConvertItemArray } from './factories/convert-item-array';
import { createConvertItemObject } from './factories/convert-item-object';
import { createConvertItemValue } from './factories/convert-item-value';
import { createCreatePropertyName } from './factories/create-property-name';
import { createFormAddStatement } from './factories/form-add-statement';
import { createFormRemoveStatement } from './factories/form-remove-statement';
import { createFormSetStatement } from './factories/form-set-statement';
import { createIsIllegalWord } from './factories/is-illegal-word';
import { createIsReservedWord } from './factories/is-reserved-word';
import { createIsTuple } from './factories/is-tuple';
import { createTransformAndConvertDataObjectFactory } from './factories/transform-and-convert-data-value';
import { createTransformDataArray } from './factories/transform-data-array';
import { createTransformDataObject } from './factories/transform-data-object';
import { createTransformDataValueFactory } from './factories/transform-data-value-factory';
import { withDateSerialization } from './functions/with-date-serialization';
import { isBooleanItemValue } from './guards/boolean-item-value';
import { isDataArray } from './guards/data-array';
import { isDataObject } from './guards/data-object';
import { isListItemValue } from './guards/list-item-value';
import { isMapItemValue } from './guards/map-item-value';
import { isNullItemValue } from './guards/null-item-value';
import { isNumberItemValue } from './guards/number-item-value';
import { isStringItemValue } from './guards/string-item-value';
import { RESERVED_WORDS } from './reserved-words';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const addSymbol = Symbol('add');
const convertDataValue = createConvertDataValue(createConvertDataArray, createConvertDataObject, isDataArray, isDataObject);
const illegalWordRegex = /[\s|.]/g;
const createPropertyName = createCreatePropertyName(illegalWordRegex);
const isReservedWord = createIsReservedWord(RESERVED_WORDS);
const isIllegalWord = createIsIllegalWord(illegalWordRegex, isReservedWord);
const formAddStatement = createFormAddStatement(convertDataValue, createPropertyName, isIllegalWord);
const formRemoveStatement = createFormRemoveStatement(createPropertyName, isIllegalWord);
const formSetStatement = createFormSetStatement(convertDataValue, createPropertyName, isIllegalWord);

export const addValue = createAddValue(addSymbol);

const convertDataObject = createConvertDataObject(convertDataValue);

export const createDataToItem = createTransformAndConvertDataObjectFactory(
    convertDataObject,
    createTransformDataValueFactory(createTransformDataArray, createTransformDataObject, isDataArray, isDataObject),
    createTransformDataObject
);

export const dataToItem = convertDataObject;

export const deltaToUpdateParams = createConvertDelta(formAddStatement, formRemoveStatement, formSetStatement, createIsTuple(addSymbol));

export const itemToData = createConvertItemObject(
    createConvertItemValue(
        createConvertItemArray,
        createConvertItemObject,
        isBooleanItemValue,
        isListItemValue,
        isMapItemValue,
        isNullItemValue,
        isNumberItemValue,
        isStringItemValue
    )
);

export { withDateSerialization };
