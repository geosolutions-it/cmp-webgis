/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const MapUtils = require('../../MapStore2/web/client/utils/MapUtils');
const Dialog = require('../../MapStore2/web/client/components/misc/Dialog');
const {Row, Col, Glyphicon} = require('react-bootstrap');

const {toggleControl} = require('../../MapStore2/web/client/actions/controls');
const {mapSelector} = require('../../MapStore2/web/client/selectors/map');
const {layersSelector} = require('../../MapStore2/web/client/selectors/layers');

const {createSelector} = require('reselect');

const assign = require('object-assign');

const {scalesSelector} = require('../../MapStore2/web/client/selectors/map');

require('../../MapStore2/web/client/plugins/print/print.css');

const {
    LegendOption,
    MultiPageOption,
    LandscapeOption,
    PrintPreview
} = require('../../MapStore2/web/client/plugins/print/index');

const PrintUtils = require('../../MapStore2/web/client/utils/PrintUtils');
const Message = require('../../MapStore2/web/client/components/I18N/Message');

const PrintPreviewPanel = React.createClass({
    propTypes: {
        map: React.PropTypes.object,
        layers: React.PropTypes.array,
        capabilities: React.PropTypes.object,
        printSpec: React.PropTypes.object,
        printSpecTemplate: React.PropTypes.object,
        open: React.PropTypes.bool,
        pdfUrl: React.PropTypes.string,
        title: React.PropTypes.string,
        style: React.PropTypes.object,
        mapWidth: React.PropTypes.number,
        mapType: React.PropTypes.string,
        alternatives: React.PropTypes.array,
        toggleControl: React.PropTypes.func,
        setPage: React.PropTypes.func,
        getPrintSpecification: React.PropTypes.func,
        getLayoutName: React.PropTypes.func,
        error: React.PropTypes.string,
        getZoomForExtent: React.PropTypes.func,
        minZoom: React.PropTypes.number,
        maxZoom: React.PropTypes.number,
        usePreview: React.PropTypes.bool,
        mapPreviewOptions: React.PropTypes.object,
        syncMapPreview: React.PropTypes.bool,
        useFixedScales: React.PropTypes.bool,
        scales: React.PropTypes.array,
        ignoreLayers: React.PropTypes.array,
        defaultBackground: React.PropTypes.string,
        closeGlyph: React.PropTypes.string,
        submitConfig: React.PropTypes.object,
        previewOptions: React.PropTypes.object
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            title: 'print.paneltitle',
            toggleControl: () => {},
            setPage: () => {},
            printSpecTemplate: {},
            getPrintSpecification: PrintUtils.getMapfishPrintSpecification,
            getLayoutName: PrintUtils.getLayoutName,
            getZoomForExtent: MapUtils.defaultGetZoomForExtent,
            pdfUrl: null,
            mapWidth: 370,
            mapType: "leaflet",
            minZoom: 1,
            maxZoom: 23,
            alternatives: [{
                name: "legend",
                component: LegendOption,
                regex: /legend/
            }, {
                name: "2pages",
                component: MultiPageOption,
                regex: /2_pages/
            }, {
                name: "landscape",
                component: LandscapeOption,
                regex: /landscape/
            }],
            usePreview: true,
            mapPreviewOptions: {},
            syncMapPreview: false,
            useFixedScales: true,
            scales: [],
            ignoreLayers: ["google", "bing"],
            defaultBackground: "osm",
            closeGlyph: "",
            submitConfig: {
                buttonConfig: {
                    bsSize: "large"
                },
                glyph: "print"
            },
            style: {}
        };
    },
    renderPreviewPanel() {
        return <PrintPreview {...this.props.previewOptions} role="body" prevPage={this.prevPage} nextPage={this.nextPage}/>;
    },
    renderError() {
        if (this.props.error) {
            return <Row><Col xs={12}><div className="print-error"><span>{this.props.error}</span></div></Col></Row>;
        }
        return null;
    },
    renderWarning(layout) {
        if (!layout) {
            return <Row><Col xs={12}><div className="print-warning"><span><Message msgId="print.layoutWarning"/></span></div></Col></Row>;
        }
        return null;
    },
    renderDownload() {
        if (this.props.pdfUrl && !this.props.usePreview) {
            return <iframe src={this.props.pdfUrl} style={{visibility: "hidden", display: "none"}}/>;
        }
        return null;
    },
    renderRole(role) {
        return React.Children.toArray(this.props.children).filter((child) => child.props.role === role);
    },
    render() {
        if (this.props.pdfUrl) {
            return (<Dialog id="mapstore-print-preview-panel" style={this.props.style}>
                <span role="header"><span className="print-panel-title"><Message msgId="print.paneltitle"/></span><button onClick={this.props.toggleControl} className="print-panel-close close">{this.props.closeGlyph ? <Glyphicon glyph={this.props.closeGlyph}/> : <span>×</span>}</button></span>
                {this.renderPreviewPanel()}
            </Dialog>);
        }
        return null;
    },
    hasRole(role) {
        return React.Children.toArray(this.props.children).filter((child) => child.props.role === role).length > 0;
    }
});

const selector = createSelector([
    (state) => (state.controls.print && state.controls.print.enabled ) || (state.controls.toolbar && state.controls.toolbar.active === 'print'),
    (state) => state.print && state.print.capabilities,
    (state) => state.print && state.print.spec && assign({}, state.print.spec, state.print.map || {}),
    (state) => state.print && state.print.pdfUrl,
    (state) => state.print && state.print.error,
    mapSelector,
    layersSelector,
    scalesSelector,
    (state) => state.browser && (!state.browser.ie || state.browser.ie11)
], (open, capabilities, printSpec, pdfUrl, error, map, layers, scales, usePreview) => ({
    open,
    capabilities,
    printSpec,
    pdfUrl,
    error,
    map,
    layers,
    scales,
    usePreview
}));

const PrintPreviewPanelPlugin = connect(selector, {
    toggleControl: toggleControl.bind(null, 'print', null)
})(PrintPreviewPanel);

module.exports = {
    PrintPreviewPanelPlugin: PrintPreviewPanelPlugin,
    reducers: {print: require('../../MapStore2/web/client/reducers/print')}
};
