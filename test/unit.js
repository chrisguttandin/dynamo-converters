'use strict';

var expect = require('chai').expect,
    converters = require('../src/dynamo-converters.js');

describe('dynamo-converters', function () {

    describe('dataToItem()', function () {

        it('add default timestamps to item', function () {
            var item = converters.dataToItem({});

            expect(Object.keys(item)).to.deep.equal(['created', 'modified']);

            expect(Object.keys(item.created)).to.deep.equal(['N']);
            expect(item.created).to.be.an('object');
            expect(item.created.N).to.be.an('string');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(Object.keys(item.modified)).to.deep.equal(['N']);
            expect(item.modified).to.be.an('object');
            expect(item.modified.N).to.be.an('string');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);
        });

        it('convert a data object into an item', function () {
            var item = converters.dataToItem(global.fixtures.data);

            expect(Object.keys(item)).to.deep.equal(['ears', 'map', 'name', 'created', 'modified']);

            expect(Object.keys(item.created)).to.deep.equal(['N']);
            expect(item.created).to.be.an('object');
            expect(item.created.N).to.be.an('string');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(item.ears).to.deep.equal(global.fixtures.item.ears);

            expect(Object.keys(item.modified)).to.deep.equal(['N']);
            expect(item.modified).to.be.an('object');
            expect(item.modified.N).to.be.an('string');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(item.name).to.deep.equal(global.fixtures.item.name);

            expect(item.map).to.deep.equal(global.fixtures.item.map);
        });

    });

    describe('deltaToAttributes()', function () {

        it('add default timestamp to attributes', function () {
            var attributes = converters.deltaToAttributes({});

            expect(Object.keys(attributes)).to.deep.equal(['modified']);

            expect(Object.keys(attributes.modified)).to.deep.equal(['Action', 'Value']);
            expect(attributes.modified.Action).to.equal('PUT');

            expect(Object.keys(attributes.modified.Value)).to.deep.equal(['N']);
            expect(attributes.modified.Value.N).to.be.an('string');
            expect(parseInt(attributes.modified.Value.N, 10)).to.be.closeTo(Date.now(), 100);
        });

        it('convert a delta into attributes', function () {
            var attributes = converters.deltaToAttributes(global.fixtures.delta);

            expect(Object.keys(attributes)).to.deep.equal(['ears', 'eyes', 'legs', 'name', 'numbers', 'modified']);

            expect(attributes.ears).to.deep.equal(global.fixtures.attributes.ears);

            expect(attributes.eyes).to.deep.equal(global.fixtures.attributes.eyes);

            expect(attributes.legs).to.deep.equal(global.fixtures.attributes.legs);

            expect(Object.keys(attributes.modified)).to.deep.equal(['Action', 'Value']);
            expect(attributes.modified.Action).to.equal('PUT');

            expect(Object.keys(attributes.modified.Value)).to.deep.equal(['N']);
            expect(attributes.modified.Value.N).to.be.an('string');
            expect(parseInt(attributes.modified.Value.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(attributes.name).to.deep.equal(global.fixtures.attributes.name);

            expect(attributes.numbers).to.deep.equal(global.fixtures.attributes.numbers);
        });

    });

    describe('itemToData', function () {

        it('add no default properties to data at all', function () {
            var data = converters.itemToData({});

            expect(data).to.deep.equal({});
        });

        it('convert a item into data', function () {
            var data = converters.itemToData(global.fixtures.item);

            expect(data).to.deep.equal(global.fixtures.data);
        });

    });

});
