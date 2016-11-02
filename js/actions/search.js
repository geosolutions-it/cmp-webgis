/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Capi = require('../api/Customapi');

const TEXT_SEARCH_RESULTS_LOADED = 'TEXT_SEARCH_RESULTS_LOADED';
const TEXT_SEARCH_PERFORMED = 'TEXT_SEARCH_PERFORMED';
const TEXT_SEARCH_RESULTS_PURGE = 'TEXT_SEARCH_RESULTS_PURGE';
const TEXT_SEARCH_RESET = 'TEXT_SEARCH_RESET';
const TEXT_SEARCH_ADD_MARKER = 'TEXT_SEARCH_ADD_MARKER';
const TEXT_SEARCH_TEXT_CHANGE = 'TEXT_SEARCH_TEXT_CHANGE';

function searchResultLoaded(results, append=false) {
    return {
        type: TEXT_SEARCH_RESULTS_LOADED,
        results: results.data,
        append: append
    };
}

function searchTextChanged(text) {
    return {
        type: TEXT_SEARCH_TEXT_CHANGE,
        searchText: text
    };
}

function resultsPurge() {
    return {
        type: TEXT_SEARCH_RESULTS_PURGE
    };
}

function resetSearch() {
    return {
        type: TEXT_SEARCH_RESET
    };
}

function textSearch(text) {
    const options = {data: ['result1', 'result2']};
    return (dispatch) => {
        const result = Capi.searchtext(text, options);
        if (result) {
            dispatch(searchResultLoaded(result));
        }
    };
}


module.exports = {
    TEXT_SEARCH_RESULTS_LOADED,
    TEXT_SEARCH_PERFORMED,
    TEXT_SEARCH_RESULTS_PURGE,
    TEXT_SEARCH_RESET,
    TEXT_SEARCH_ADD_MARKER,
    TEXT_SEARCH_TEXT_CHANGE,
    searchResultLoaded,
    textSearch,
    resultsPurge,
    resetSearch,
    searchTextChanged
};
