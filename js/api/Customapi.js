/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
// const assign = require('object-assign');
// const DEFAULT_URL = 'nominatim.openstreetmap.org';

/**
 * API for local config
 */
const Api = {
    searchtext: function(text, options) {
        if ( text === options[0].name) {
            return true;
        }
        return false;
    }
};

module.exports = Api;
