/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var {Button, Glyphicon, OverlayTrigger, Tooltip} = require('react-bootstrap');

var GraticuleBtn = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        btnConfig: React.PropTypes.object,
        text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        help: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        show: React.PropTypes.bool,
        layer: React.PropTypes.string,
        onClick: React.PropTypes.func,
        tooltip: React.PropTypes.element,
        tooltipPlace: React.PropTypes.string,
        style: React.PropTypes.object,
        bsStyle: React.PropTypes.string,
        glyph: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            id: "graticule-btn",
            onClick: () => {},
            show: false,
            layer: "graticule",
            tooltipPlace: "left",
            bsStyle: "default",
            glyph: "th"
        };
    },
    onClick() {
        this.props.onClick(this.props.layer, {
            visibility: !this.props.show
        });
    },
    renderButton() {
        return (
            <Button id={this.props.id} {...this.props.btnConfig} onClick={this.onClick} bsStyle={this.getBtnStyle()} style={this.props.style}>
                <Glyphicon glyph={this.props.glyph}/>
            </Button>
        );
    },
    addTooltip(btn) {
        let tooltip = <Tooltip id="graticule-tooltip">{this.props.tooltip}</Tooltip>;
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

module.exports = GraticuleBtn;
