/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {changeDrawingStatus} = require('../../MapStore2/web/client/actions/draw');

const DRAW_RECTANGLE = 'DRAW_RECTANGLE';

function drawRectangle(inputs) {
    return {
        type: DRAW_RECTANGLE,
        params: inputs
    };
}

function onCreate(values) {
    return (dispatch) => {
        var status = "clean";
        var features = [];
        if (values.visibility === true) {
            status = "create";
            features = [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [values.options[0], values.options[1]],
                        [values.options[2], values.options[1]],
                        [values.options[2], values.options[3]],
                        [values.options[0], values.options[3]],
                        [values.options[0], values.options[1]]
                    ]]
                }
            }];
            dispatch(drawRectangle(values));
            dispatch(changeDrawingStatus(status, "", "", features));
        }else {
            dispatch(drawRectangle(values));
            dispatch(changeDrawingStatus(status, "", "", features));
        }
    };
}

module.exports = {
    DRAW_RECTANGLE,
    onCreate,
    drawRectangle
};
