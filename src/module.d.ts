declare const dynamoConverters: {

    dataToItem(data: any): any;

    deltaToExpression(delta: any): any;

    itemToData(item: any): any;

};

export default dynamoConverters;
