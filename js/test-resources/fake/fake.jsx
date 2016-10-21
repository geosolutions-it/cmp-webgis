/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const TOGGLE_CONTROL = 'TOGGLE_CONTROL';
function toggleControl(control, property) {
    return {
        type: TOGGLE_CONTROL,
        control,
        property
    };
}

module.exports = {TOGGLE_CONTROL, toggleControl};
