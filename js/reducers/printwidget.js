/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var {DRAW_RECTANGLE} = require('../actions/printwidget');

const assign = require('object-assign');

function printwidget(state = null, action) {
    switch (action.type) {
        case DRAW_RECTANGLE:
            return assign({}, state, { visibility: action.params.visibility, bbox: action.params.options });
        default:
            return state;
    }
}

module.exports = printwidget;
