/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * API for local config
 */
const Api = {
    searchtext: function(text, options) {
        const results = {data: ['result1', 'result2']};
        if ( text === options.data[0]) {
            return results;
        }
        return null;
    }
};

module.exports = Api;
