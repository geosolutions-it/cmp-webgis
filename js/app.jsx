/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const {connect} = require('react-redux');

require('../MapStore2/web/client/product/assets/css/viewer.css');

const StandardApp = require('../MapStore2/web/client/components/app/StandardApp');

const {pages, pluginsDef, initialState, storeOpts} = require('./appConfig');
const LocaleUtils = require('../MapStore2/web/client/utils/LocaleUtils');

LocaleUtils.setSupportedLocales({
    "en": {
       code: "en-US",
       description: "English"
    }
});

const StandardRouter = connect((state) => ({
    locale: state.locale || {},
    pages
}))(require('../MapStore2/web/client/components/app/StandardRouter'));

const appStore = require('../MapStore2/web/client/stores/StandardStore').bind(null, initialState, {});

const appConfig = {
    storeOpts,
    appStore,
    pluginsDef,
    initialActions: [],
    appComponent: StandardRouter,
    printingEnabled: true
};

ReactDOM.render(
    <StandardApp {...appConfig}/>,
    document.getElementById('container')
);
