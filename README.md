# dynamo-converters

**A collection of converter functions to get good old JavaScript key/value objects into a DynamoDB friendly schema and back again.**

[![tests](https://img.shields.io/travis/chrisguttandin/dynamo-converters/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/dynamo-converters)
[![dependencies](https://img.shields.io/david/chrisguttandin/dynamo-converters.svg?style=flat-square)](https://www.npmjs.com/package/dynamo-converters)
[![version](https://img.shields.io/npm/v/dynamo-converters.svg?style=flat-square)](https://www.npmjs.com/package/dynamo-converters)

## Functionality

Amazon's official
[aws-sdk for JavaScript](https://aws.amazon.com/de/documentation/sdk-for-javascript) uses a
relatively verbose data structure to
[put](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property), [update](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property)
or
[delete](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property)
items stored inside a DynamoDB table. This is of course necessary to cover all possible use cases.
But most of the time a much simpler data structure does the job as well. This little package is made
for those simple cases.

If you think the official SDK is to verbose but this package does not cover all your needs you might
want to take a look at [dynamodb-data-types](https://github.com/kayomarz/dynamodb-data-types) by
[kayomarz](https://github.com/kayomarz).

## Getting Started

This package is available on [npm](https://www.npmjs.org/package/dynamo-converters) and can be
installed as usual:

```shell
npm install dynamo-converters
```

You can then use `dynamo-converters` by requiring it:

```js
var dynamoConverters = require('dynamo-converters');
```

## Documentation

`dynamo-converters` does provide three functions:

### item : dataToItem( data )

This function takes a plain JavaScript object as input and returns a structured item which can then
be used with the official SDK.

In addition to that `dataToItem()` also adds a `created` and `modified` field to each item. This is
because the resulting item structure is most likely used to put an item into a DynamoDB table.

```js
var data = {
        object: {
            nothing: undefined,
            number: 2,
            string: 'lorem ipsum'
        }
    };

console.log(dynamoConverters.dataToItem(data));

// {
//     created: {
//         N: '1448752278557'
//     },
//     modified: {
//         N: '1448752278557'
//     },
//     object: {
//         M: {
//             number: { N: '2' },
//             string: { S: 'lorem ipsum' }
//         }
//     }
// }
```

Please have a look at the
[unit tests](https://github.com/chrisguttandin/dynamo-converters/blob/master/test/unit.js#L8) for
more examples.

### expression : deltaToExpression( delta )

This function takes a plain JavaScript object as input and returns all parts of an expression which
can then be used with the official SDK.

In addition to that `deltaToExpression()` also adds a `modified` field to each item. This is
because the resulting expression is most likely used to update an item of a DynamoDB table.

`deltaToExpression()` also takes care of
[reserved words](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
and populates the `expressionAttributeNames` property of the returned object if needed. If the delta
contains no reserved word this property will be missing.

```js
var delta = {
        nothing: undefined,
        object: {
            number: 2,
            string: 'lorem ipsum'
        }
    };

console.log(dynamoConverters.deltaToExpression(delta));

// {
//     expressionAttributeNames: {
//         '#object': 'object'
//     },
//     expressionAttributeValues: {
//         ':modified': {
//             N: '1448752278557'
//         },
//         ':object': {
//             M: {
//                 number: {
//                     N: '2'
//                 },
//                 string: {
//                     S: 'lorem ipsum'
//                 }
//             }
//         }
//     },
//     updateExpression: 'REMOVE nothing SET modified = :modified, #object = :object'
// }
```

Please have a look at the
[unit tests](https://github.com/chrisguttandin/dynamo-converters/blob/master/test/unit.js#L70) for
more examples.

### data : itemToData( item )

This function takes a structured item returned by the official SDK and turns it into a plain
JavaScript object.

```js
var item = {
        created: {
            N: '1448752278557'
        },
        modified: {
            N: '1448752278557'
        },
        object: {
            M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            }
        }
    };

console.log(dynamoConverters.itemToData(item));

// {
//     created: 1448752278557,
//     modified: 1448752278557,
//     object: {
//         number: 2,
//         string: 'lorem ipsum'
//     }
// }
```

Please have a look at the
[unit tests](https://github.com/chrisguttandin/dynamo-converters/blob/master/test/unit.js) for
more examples.
