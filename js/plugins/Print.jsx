/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');
const CoordinatesUtils = require('../../MapStore2/web/client/utils/CoordinatesUtils');
const MapUtils = require('../../MapStore2/web/client/utils/MapUtils');
require('./print/print.css');
const ScaleBox = require("../../MapStore2/web/client/components/mapcontrols/scale/ScaleBox");
const {Grid, Row, Col, Panel, Accordion, Glyphicon} = require('react-bootstrap');

const {toggleControl} = require('../../MapStore2/web/client/actions/controls');
const {printSubmit, printSubmitting, configurePrintMap} = require('../../MapStore2/web/client/actions/print');

const {mapSelector} = require('../../MapStore2/web/client/selectors/map');
const {layersSelector} = require('../../MapStore2/web/client/selectors/layers');

const {createSelector} = require('reselect');

const assign = require('object-assign');

const {head} = require('lodash');

const {scalesSelector} = require('../../MapStore2/web/client/selectors/map');

require('../../MapStore2/web/client/plugins/print/print.css');

const {
    Name,
    Description,
    Resolution,
    Sheet,
    LegendOption,
    MultiPageOption,
    LandscapeOption,
    ForceLabelsOption,
    AntiAliasingOption,
    IconSizeOption,
    LegendDpiOption,
    Font,
    PrintSubmit
} = require('../../MapStore2/web/client/plugins/print/index');

const PrintUtils = require('../../MapStore2/web/client/utils/PrintUtils');
const Message = require('../../MapStore2/web/client/components/I18N/Message');

const Print = React.createClass({
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
        onBeforePrint: React.PropTypes.func,
        onPrint: React.PropTypes.func,
        configurePrintMap: React.PropTypes.func,
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
        submitConfig: React.PropTypes.object,
        enableScalebox: React.PropTypes.bool,
        onChangeZoomLevel: React.PropTypes.func
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            title: 'print.paneltitle',
            enableScalebox: true,
            toggleControl: () => {},
            onBeforePrint: () => {},
            onPrint: () => {},
            configurePrintMap: () => {},
            onChangeZoomLevel: () => {},
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
            submitConfig: {
                buttonConfig: {
                    bsSize: "large"
                },
                glyph: "print"
            },
            style: {}
        };
    },
    componentWillMount() {
        if (this.props.usePreview && !window.PDFJS) {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "https://unpkg.com/pdfjs-dist@1.4.79/build/pdf.combined.js";
            document.head.appendChild(s);
        }
        this.configurePrintMap();
    },
    componentWillReceiveProps(nextProps) {
        const hasBeenOpened = nextProps.open && !this.props.open;
        const mapHasChanged = this.props.open && this.props.syncMapPreview && MapUtils.mapUpdated(this.props.map, nextProps.map);
        const specHasChanged = nextProps.printSpec.defaultBackground !== this.props.printSpec.defaultBackground;
        if (hasBeenOpened || mapHasChanged || specHasChanged) {
            this.configurePrintMap(nextProps.map, nextProps.printSpec);
        }
    },
    getMapSize(layout) {
        const currentLayout = layout || this.getLayout();
        return {
            width: this.props.mapWidth,
            height: currentLayout && currentLayout.map.height / currentLayout.map.width * this.props.mapWidth || 270
        };
    },
    getLayout() {
        const layoutName = this.props.getLayoutName(this.props.printSpec);
        return head(this.props.capabilities.layouts.filter((l) => l.name === layoutName));
    },
    renderLayoutsAlternatives() {
        return this.props.alternatives.map((alternative) => (
            <alternative.component key={"printoption_" + alternative.name}
                label={LocaleUtils.getMessageById(this.context.messages, "print.alternatives." + alternative.name)}
                enableRegex={alternative.regex}
            />
        ));
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
    renderPrintPanel() {
        const layout = this.getLayout();
        return (
            <Grid fluid role="body">
            {this.renderError()}
            {this.renderWarning(layout)}
            <Row>
                <Col xs={12} md={12}>
                    <Name label={LocaleUtils.getMessageById(this.context.messages, 'print.title')} placeholder={LocaleUtils.getMessageById(this.context.messages, 'print.titleplaceholder')} />
                    <Description label={LocaleUtils.getMessageById(this.context.messages, 'print.description')} placeholder={LocaleUtils.getMessageById(this.context.messages, 'print.descriptionplaceholder')} />
                    <Accordion defaultActiveKey="1">
                        <Panel className="print-layout" header={LocaleUtils.getMessageById(this.context.messages, "print.layout")} eventKey="1" collapsible>
                            <Sheet key="sheetsize"
                                layouts={this.props.capabilities.layouts}
                                label={LocaleUtils.getMessageById(this.context.messages, "print.sheetsize")}
                                />
                            {this.renderLayoutsAlternatives()}
                        </Panel>
                        <Panel className="print-legend-options" header={LocaleUtils.getMessageById(this.context.messages, "print.legendoptions")} eventKey="2" collapsible>
                            <Font label={LocaleUtils.getMessageById(this.context.messages, "print.legend.font")}/>
                            <ForceLabelsOption label={LocaleUtils.getMessageById(this.context.messages, "print.legend.forceLabels")}/>
                            <AntiAliasingOption label={LocaleUtils.getMessageById(this.context.messages, "print.legend.antiAliasing")}/>
                            <IconSizeOption label={LocaleUtils.getMessageById(this.context.messages, "print.legend.iconsSize")}/>
                            <LegendDpiOption label={LocaleUtils.getMessageById(this.context.messages, "print.legend.dpi")}/>
                        </Panel>
                    </Accordion>
                </Col>
                <Col xs={12} md={12} style={{textAlign: "center"}}>
                    <Resolution label={LocaleUtils.getMessageById(this.context.messages, "print.resolution")}/>
                    {this.props.enableScalebox ? <div className="mappreview-scalebox-head"><label>Scale:</label><ScaleBox id="mappreview-scalebox"
                            currentZoomLvl={this.props.map.scaleZoom}
                            scales={this.props.scales}
                            onChange={this.props.onChangeZoomLevel}
                            /> </div> : null}
                    <PrintSubmit {...this.props.submitConfig} disabled={!layout} onPrint={this.print}/>
                </Col>
            </Row>
        </Grid>
        );
    },
    renderBody() {
        return this.renderPrintPanel();
    },
    render() {
        if ((this.props.capabilities || this.props.error)) {
            return (<div className="mapstore-print-panel-view">
                {this.renderBody()}
            </div>);
        }
        return null;
    },
    isAllowed(layer) {
        return this.props.ignoreLayers.indexOf(layer.type) === -1;
    },
    isBackgroundIgnored() {
        return this.props.layers.filter((layer) => layer.visibility && !this.isAllowed(layer)).length > 0;
    },
    filterLayers(printSpec) {
        const filtered = this.props.layers.filter((layer) => layer.visibility && this.isAllowed(layer));
        if (this.isBackgroundIgnored() && this.props.defaultBackground && printSpec.defaultBackground) {
            const defaultBackground = this.props.layers.filter((layer) => layer.type === this.props.defaultBackground)[0];
            return [assign({}, defaultBackground, {visibility: true}), ...filtered];
        }
        return filtered;
    },
    configurePrintMap(map, printSpec) {
        const newMap = map || this.props.map;
        const newPrintSpec = printSpec || this.props.printSpec;
        if (newMap && newMap.bbox && this.props.capabilities) {
            const bbox = CoordinatesUtils.reprojectBbox([
                newMap.bbox.bounds.minx,
                newMap.bbox.bounds.miny,
                newMap.bbox.bounds.maxx,
                newMap.bbox.bounds.maxy
            ], newMap.bbox.crs, newMap.projection);
            const mapSize = this.getMapSize();
            if (this.props.useFixedScales) {
                const mapZoom = this.props.getZoomForExtent(bbox, mapSize, this.props.minZoom, this.props.maxZoom);
                const scales = PrintUtils.getPrintScales(this.props.capabilities);
                const scaleZoom = PrintUtils.getNearestZoom(newMap.zoom, scales);

                this.props.configurePrintMap(newMap.center, mapZoom, scaleZoom, scales[scaleZoom],
                    this.filterLayers(newPrintSpec), newMap.projection);
            } else {
                this.props.configurePrintMap(newMap.center, newMap.zoom, newMap.zoom, this.props.scales[newMap.zoom],
                    this.filterLayers(newPrintSpec), newMap.projection);
            }
        }
    },
    print() {
        const spec = this.props.getPrintSpecification(this.props.printSpec);
        this.props.onBeforePrint();
        this.props.onPrint(this.props.capabilities.createURL, spec);
    }
});

const selector = createSelector([
    (state) => state.controls.toolbar && state.controls.toolbar.active === 'print',
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

const PrintPlugin = connect(selector, {
    toggleControl: toggleControl.bind(null, 'print', null),
    onPrint: printSubmit,
    onBeforePrint: printSubmitting,
    configurePrintMap
})(Print);

module.exports = {
    PrintPlugin: assign(PrintPlugin, {
        Toolbar: {
            name: 'print',
            position: 7,
            wrap: true,
            help: <Message msgId="helptexts.print"/>,
            tooltip: "printbutton",
            icon: <Glyphicon glyph="print"/>,
            exclusive: true,
            panel: true,
            priority: 1
        },
        DrawerMenu: {
            name: 'printbutton',
            position: 4,
            icon: <Glyphicon glyph="print"/>,
            title: 'printbutton',
            priority: 2
        }
    }),
    reducers: {print: require('../../MapStore2/web/client/reducers/print')}
};
