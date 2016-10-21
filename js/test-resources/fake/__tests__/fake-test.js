/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var expect = require('expect');
var {
    TOGGLE_CONTROL,
    toggleControl
} = require('../fake');

describe('Test correctness of the fake action actions', () => {

    it('toggleControl', () => {
        const testControl = 'test';
        var retval = toggleControl(testControl);

        expect(retval).toExist();
        expect(retval.type).toBe(TOGGLE_CONTROL);
        expect(retval.control).toBe(testControl);
        expect(retval.property).toNotExist();
    });
});
