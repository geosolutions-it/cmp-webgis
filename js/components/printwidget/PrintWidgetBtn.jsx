/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var {Button, Glyphicon, OverlayTrigger, Tooltip} = require('react-bootstrap');
const CoordinatesUtils = require('../../../MapStore2/web/client/utils/CoordinatesUtils');
var PrintWidgetBtn = React.createClass({
    propTypes: {
        map: React.PropTypes.object,
        layers: React.PropTypes.array,
        capabilities: React.PropTypes.object,
        mapType: React.PropTypes.string,
        id: React.PropTypes.string,
        btnConfig: React.PropTypes.object,
        show: React.PropTypes.bool,
        onClick: React.PropTypes.func,
        tooltip: React.PropTypes.element,
        tooltipPlace: React.PropTypes.string,
        style: React.PropTypes.object,
        bsStyle: React.PropTypes.string,
        glyph: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            id: "printwidget-btn",
            onClick: () => {},
            tooltipPlace: "left",
            bsStyle: "default",
            glyph: "print",
            geomType: "Rectangle"
        };
    },
    onClick() {
        const newMap = this.props.map;
        if (newMap && newMap.bbox) {
            const bbox = CoordinatesUtils.reprojectBbox([
                newMap.bbox.bounds.minx,
                newMap.bbox.bounds.miny,
                newMap.bbox.bounds.maxx,
                newMap.bbox.bounds.maxy
            ], newMap.bbox.crs, 'EPSG:4326');
            if (this.props.show === false) {
                this.props.onClick({
                    visibility: !this.props.show,
                    options: bbox
                });
            }else {
                this.props.onClick({
                    visibility: !this.props.show,
                    options: null
                });
            }
        }
    },
    renderButton() {
        return (
            <Button id={this.props.id} {...this.props.btnConfig} onClick={this.onClick} bsStyle={this.getBtnStyle()} style={this.props.style}>
                <Glyphicon glyph={this.props.glyph}/>
            </Button>
        );
    },
    addTooltip(btn) {
        let tooltip = <Tooltip id="printwidget-tooltip">{this.props.tooltip}</Tooltip>;
        return (
            <OverlayTrigger placement={this.props.tooltipPlace} key={"overlay-trigger." + this.props.id} overlay={tooltip}>
                {btn}
            </OverlayTrigger>
        );
    },
    render() {
        var retval;
        var btn = this.renderButton();
        if (this.props.tooltip) {
            retval = this.addTooltip(btn);
        } else {
            retval = btn;
        }
        return retval;
    },
    getBtnStyle() {
        if (this.props.show) {
            return "success";
        }
        return "primary";
    }
});

module.exports = PrintWidgetBtn;
