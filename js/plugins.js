/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    plugins: {
        MapPlugin: require('../MapStore2/web/client/plugins/Map'),
        HomePlugin: require('../MapStore2/web/client/plugins/Home'),
        MousePositionPlugin: require('../MapStore2/web/client/plugins/MousePosition'),
        IdentifyPlugin: require('../MapStore2/web/client/plugins/Identify'),
        TOCPlugin: require('../MapStore2/web/client/plugins/TOC'),
        BackgroundSwitcherPlugin: require('../MapStore2/web/client/plugins/BackgroundSwitcher'),
        MeasurePlugin: require('../MapStore2/web/client/plugins/Measure'),
        MeasureResultsPlugin: require('../MapStore2/web/client/plugins/MeasureResults'),
        ToolbarPlugin: require('../MapStore2/web/client/plugins/Toolbar'),
        DrawerMenuPlugin: require('../MapStore2/web/client/plugins/DrawerMenu'),
        ShapeFilePlugin: require('../MapStore2/web/client/plugins/ShapeFile'),
        SettingsPlugin: require('../MapStore2/web/client/plugins/Settings'),
        ExpanderPlugin: require('../MapStore2/web/client/plugins/Expander'),
        ScaleBoxPlugin: require('../MapStore2/web/client/plugins/ScaleBox'),
        LocatePlugin: require('../MapStore2/web/client/plugins/Locate'),
        ZoomInPlugin: require('../MapStore2/web/client/plugins/ZoomIn'),
        ZoomOutPlugin: require('../MapStore2/web/client/plugins/ZoomOut'),
        ZoomAllPlugin: require('../MapStore2/web/client/plugins/ZoomAll'),
        OmniBarPlugin: require('../MapStore2/web/client/plugins/OmniBar'),
        UndoPlugin: require('../MapStore2/web/client/plugins/History'),
        RedoPlugin: require('../MapStore2/web/client/plugins/History'),
        BurgerMenuPlugin: require('../MapStore2/web/client/plugins/BurgerMenu'),
        GraticulePlugin: require('./plugins/Graticule'),
        SearchPlugin: require('./plugins/Search')
    },
    requires: {}
};
