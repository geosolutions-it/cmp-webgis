/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');

const {changeLayerProperties} = require('../../MapStore2/web/client/actions/layers');

const Message = require('../../MapStore2/web/client/plugins/locale/Message');

const {Glyphicon} = require('react-bootstrap');

const assign = require('object-assign');


const GraticulePlugin = connect((state) => ({
    show: state.layers && state.layers.flat && state.layers.flat.filter((layer) => layer.type === "graticule").length && state.layers.flat.filter((layer) => layer.type === "graticule")[0].visibility || false,
    layer: state.layers && state.layers.flat && state.layers.flat.filter((layer) => layer.type === "graticule").length && state.layers.flat.filter((layer) => layer.type === "graticule")[0].id || "graticule"
}), {
    onClick: changeLayerProperties
})(require('../components/graticule/GraticuleBtn'));

require('../plugins/graticule/graticule.css');

module.exports = {
    GraticulePlugin: assign(GraticulePlugin, {
        Toolbar: {
            name: 'Graticule',
            position: 2,
            tool: true,
            tooltip: "graticule.tooltip",
            icon: <Glyphicon glyph="th"/>,
            help: <Message msgId="helptexts.graticuleBtn"/>,
            priority: 1
        }
    })
};
