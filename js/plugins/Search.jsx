/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {createSelector} = require('reselect');

const assign = require('object-assign');

const HelpWrapper = require('../../MapStore2/web/client/plugins/help/HelpWrapper');

const {textSearch, resultsPurge, resetSearch, searchTextChanged} = require("../actions/search");

const searchSelector = createSelector([
    state => state.search || null
], (searchState) => ({
    searchText: searchState ? searchState.searchText : ""
}));

const SearchBar = connect(searchSelector, {
    onSearch: textSearch,
    onPurgeResults: resultsPurge,
    onSearchReset: resetSearch,
    onSearchTextChange: searchTextChanged
})(require("../../MapStore2/web/client/components/mapcontrols/search/SearchBar"));

const {isArray} = require('lodash');

const MediaQuery = require('react-responsive');

const ToggleButton = require('./searchbar/ToggleButton');

const SearchPlugin = connect((state) => ({
    enabled: state.controls && state.controls.search && state.controls.search.enabled || false
}))(React.createClass({
    propTypes: {
        withToggle: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.array]),
        enabled: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            withToggle: false,
            enabled: true
        };
    },
    getSearchAndToggleButton() {
        const search = <SearchBar key="seachBar" {...this.props}/>;
        if (this.props.withToggle === true) {
            return [<ToggleButton/>].concat(this.props.enabled ? [search] : null);
        }
        if (isArray(this.props.withToggle)) {
            return (
                    <span><MediaQuery query={"(" + this.props.withToggle[0] + ")"}>
                        <ToggleButton/>
                        {this.props.enabled ? search : null}
                    </MediaQuery>
                    <MediaQuery query={"(" + this.props.withToggle[1] + ")"}>
                        {search}
                    </MediaQuery>
                </span>
            );
        }
        return search;
    },
    render() {
        return (<span>
            <HelpWrapper
                id="search-help"
                key="seachBar-help"
                    helpText="search by name" >
                    {this.getSearchAndToggleButton()}
                </HelpWrapper>
            </span>
        );
    }
}));

module.exports = {
    SearchPlugin: assign(SearchPlugin, {
        OmniBar: {
            name: 'search',
            position: 1,
            tool: true,
            priority: 1
        }
    }),
    reducers: {
        search: require('../reducers/search')
    }
};
