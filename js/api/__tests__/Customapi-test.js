/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const Api = require('../Customapi');

describe('Test correctness of the Customapi', () => {
    it('getRecords by searchtext', () => {
        const options = {data: ['result1', 'result2']};
        const results = {data: ['result1', 'result2']};
        const text = "result1";
        Api.searchtext(text, options, () => {
            if (text === options.data[0]) {
                expect(results).toExist();
                expect(results.data).toExist();
                expect(results.data.length).toBe(2);
            }
            const test = null;
            expect(test).toBe(null);
        });
    });
});
