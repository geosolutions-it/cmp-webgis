/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');

const {onCreate} = require('../actions/printwidget');

const Message = require('../../MapStore2/web/client/plugins/locale/Message');

const {Glyphicon} = require('react-bootstrap');

const assign = require('object-assign');
const PrintWidgetPlugin = connect((state) => ({
    show: state.printwidget && state.printwidget.visibility || false,
    map: state.map && state.map.present || {}
}), {
    onClick: onCreate
})(require('../components/printwidget/PrintWidgetBtn'));

require('../plugins/printwidget/printwidget.css');

module.exports = {
    PrintWidgetPlugin: assign(PrintWidgetPlugin, {
        Toolbar: {
            name: 'PrintWidget',
            position: 2,
            tool: true,
            tooltip: "printwidget.tooltip",
            icon: <Glyphicon glyph="print"/>,
            help: <Message msgId="helptexts.printwidgetBtn"/>,
            priority: 1
        }
    }),
    reducers: {
        printwidget: require('../reducers/printwidget'),
        draw: require('../../MapStore2/web/client/reducers/draw')
    }
};
