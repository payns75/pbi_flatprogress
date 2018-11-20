/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var d3 = window.d3;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5;
            (function (pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5) {
                "use strict";
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                var VisualSettings = (function (_super) {
                    __extends(VisualSettings, _super);
                    function VisualSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.dataDisplay = new dataDisplaySettings();
                        _this.dataOption = new dataOptionSettings();
                        return _this;
                    }
                    return VisualSettings;
                }(DataViewObjectsParser));
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.VisualSettings = VisualSettings;
                var dataDisplaySettings = (function () {
                    function dataDisplaySettings() {
                        this.backColor = "#D3D3D3";
                        this.fill = "#16B1E6";
                        this.bar_height = 30;
                        this.horizontal_margin = 30;
                        this.realisation_text = "Réalisation";
                        this.resteafaire_text = "Reste à faire";
                        this.ptpassage_text = "Point de passage";
                        this.ptpassage_color = "#9c27b0";
                        this.objectif_text = "Objectif:";
                        this.objectif_color = "#1b5e20";
                    }
                    return dataDisplaySettings;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.dataDisplaySettings = dataDisplaySettings;
                var dataOptionSettings = (function () {
                    function dataOptionSettings() {
                        this.ptPassage = true;
                        this.rstAFaire = true;
                        this.prctMode = false;
                        this.prctMultiPlicateur = false;
                        this.calculAuto = false;
                    }
                    return dataOptionSettings;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.dataOptionSettings = dataOptionSettings;
            })(pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 || (visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5;
            (function (pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5) {
                "use strict";
                var DomEngine = (function () {
                    function DomEngine(element) {
                        this.element = element;
                        this.data = {};
                        this.getvalue = function (item, name) {
                            return item[name] && typeof (item[name]) === "function" ? item[name]() : item[name];
                        };
                        element.attributes;
                        var nodes = element.querySelectorAll("*");
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id) {
                                this.data[nodes[i].id] = nodes[i];
                            }
                        }
                    }
                    DomEngine.prototype.update = function (vm) {
                        var _this = this;
                        vm.forEach(function (item) {
                            var el = _this.data[item.id];
                            var visible = false;
                            if (item["visible"] !== undefined) {
                                el.style.visibility = _this.getvalue(item, "visible") ? "visible" : "collapse";
                                visible = true;
                            }
                            else {
                                visible = true;
                            }
                            if (visible) {
                                if (item["value"] !== undefined) {
                                    var value = _this.getvalue(item, "value");
                                    el.innerHTML = value ? String(value) : "";
                                }
                                if (item["attr"] !== undefined) {
                                    for (var attr_name in item["attr"]) {
                                        var v = _this.getvalue(item["attr"], attr_name);
                                        if (_this.getvalue(item["attr"], attr_name)) {
                                            el.setAttribute(attr_name, v);
                                        }
                                        else {
                                            el.removeAttribute(attr_name);
                                        }
                                    }
                                }
                                if (item["style"] !== undefined) {
                                    for (var style_name in item["style"]) {
                                        var v = _this.getvalue(item["style"], style_name);
                                        el.style[style_name] = v ? v : "";
                                    }
                                }
                            }
                        });
                    };
                    return DomEngine;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.DomEngine = DomEngine;
            })(pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 || (visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5;
            (function (pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5) {
                "use strict";
                var Visual = (function () {
                    function Visual(options) {
                        try {
                            this.visual_top = document.createElement("div");
                            this.visual_top.className = "visual_top";
                            options.element.appendChild(this.visual_top);
                            var infos_container_html = "\n                <div class=\"container\">\n                    <div class=\"left_container\">\n                        <div class=\"current_value_container\">\n                            <div id=\"current_value_libelle\" class=\"current_value_libelle\"></div>\n                            <div id=\"current_value\" class=\"current_value\"></div>\n                        </div>\n                        <div id=\"percent_value\" class=\"percent_value\"></div>\n                    </div>\n                    <div class=\"right_container\">\n                        <div id=\"reste_value\" class=\"reste_value\"></div>\n                        <div id=\"reste_legend\" class=\"reste_legend\"></div>\n                    </div>\n                </div>\n                <svg id=\"svg\">\n                    <rect id=\"back_rectangle\"></rect>\n                    <rect id=\"front_rectangle\"></rect>\n                    <line id=\"objectif_rectangle\" width=\"3\" y1=\"0\" stroke-width=\"1\"></line>\n                    <text id=\"zero_text\" text-anchor=\"right\">0</text>\n                    <polygon id=\"objectif_triangle\" points=\"0 0,7 10,-7 10\"></polygon>\n                    <text id=\"objectif_text\"></text>\n                    <line id=\"ptpassage_rectangle\" y1=\"0\" stroke-width=\"3\" stroke-dasharray=\"5,5\"></line>\n                </svg>\n                <div id=\"ptpassage_container\" class=\"ptpassage_container\">\n                    <div id=\"ptpassage_value\" class=\"ptpassage_value\"></div>\n                    <div id=\"ptpassage_legend\" class=\"ptpassage_legend\"></div>\n                </div>\n            ";
                            this.visual_top.innerHTML = infos_container_html;
                            this.engine = new pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.DomEngine(this.visual_top);
                        }
                        catch (ex) {
                            console.error('Constructor Error', ex);
                        }
                    }
                    Visual.prototype.update = function (options) {
                        // TEST : objectif_value != 0
                        try {
                            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                            this.visual_top.setAttribute("style", "height:" + options.viewport.height + "px;margin: 0 " + this.settings.dataDisplay.horizontal_margin + "px");
                            var gwidth_1 = this.visual_top.clientWidth;
                            var svg_bottom_height = 36;
                            var _settings_1 = this.settings;
                            var value_1 = Visual.getvalue(options.dataViews[0].categorical, "measure");
                            var objectif_value_1 = Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
                            var pt_passage_value_1 = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
                            var todo_measure_1 = +Visual.getvalue(options.dataViews[0].categorical, "todo_measure");
                            var prct_measure_1 = +Visual.getvalue(options.dataViews[0].categorical, "prct_measure");
                            if (this.settings.dataOption.calculAuto) {
                                if (objectif_value_1) {
                                    prct_measure_1 = value_1 / objectif_value_1 * 100;
                                }
                                var tmp = objectif_value_1 - value_1;
                                todo_measure_1 = tmp < 0 ? 0 : tmp;
                            }
                            else {
                                if (prct_measure_1 && this.settings.dataOption.prctMultiPlicateur) {
                                    prct_measure_1 *= 100;
                                }
                            }
                            var front_total_width = gwidth_1 - gwidth_1 * 10 / 100;
                            var value_position = 0;
                            var objectif_position_1 = 0;
                            if (objectif_value_1 < value_1) {
                                value_position = front_total_width;
                                objectif_position_1 = objectif_value_1 / value_1 * front_total_width;
                            }
                            else {
                                value_position = prct_measure_1 / 100 * front_total_width;
                                objectif_position_1 = front_total_width;
                            }
                            var ptpassage_position_1 = pt_passage_value_1 / objectif_value_1 * objectif_position_1;
                            var prctsuffix_1 = this.settings.dataOption.prctMode ? '%' : '';
                            var vm = [{
                                    id: "current_value_libelle",
                                    visible: !!this.settings.dataDisplay.realisation_text && !!value_1,
                                    value: this.settings.dataDisplay.realisation_text
                                },
                                {
                                    id: "current_value",
                                    visible: !!value_1,
                                    value: function () {
                                        if (value_1) {
                                            var tmp = _settings_1.dataOption.prctMode && _settings_1.dataOption.prctMultiPlicateur ? value_1 * 100 : +value_1;
                                            return (tmp).toLocaleString() + prctsuffix_1;
                                        }
                                    },
                                },
                                {
                                    id: "percent_value",
                                    visible: !!prct_measure_1 && !this.settings.dataOption.prctMode,
                                    value: function () {
                                        if (prct_measure_1) {
                                            return ((+prct_measure_1).toFixed(0)).toLocaleString() + "%";
                                        }
                                    },
                                },
                                {
                                    id: "reste_legend",
                                    visible: !!this.settings.dataDisplay.resteafaire_text
                                        && (!!todo_measure_1 || todo_measure_1 === 0)
                                        && this.settings.dataOption.rstAFaire,
                                    value: this.settings.dataDisplay.resteafaire_text
                                },
                                {
                                    id: "reste_value",
                                    visible: (!!todo_measure_1 || todo_measure_1 === 0)
                                        && this.settings.dataOption.rstAFaire,
                                    value: function () {
                                        if (todo_measure_1 || todo_measure_1 === 0) {
                                            var tmp = _settings_1.dataOption.prctMode && _settings_1.dataOption.prctMultiPlicateur ? todo_measure_1 * 100 : +todo_measure_1;
                                            return (tmp).toLocaleString() + prctsuffix_1;
                                        }
                                    },
                                },
                                {
                                    id: "svg",
                                    attr: {
                                        width: gwidth_1,
                                        height: this.settings.dataDisplay.bar_height + svg_bottom_height
                                    }
                                },
                                {
                                    id: "back_rectangle",
                                    attr: {
                                        width: gwidth_1,
                                        height: this.settings.dataDisplay.bar_height,
                                        fill: this.settings.dataDisplay.backColor
                                    }
                                },
                                {
                                    id: "front_rectangle",
                                    attr: {
                                        width: value_position,
                                        height: this.settings.dataDisplay.bar_height,
                                        fill: this.settings.dataDisplay.fill
                                    }
                                },
                                {
                                    id: "zero_text",
                                    visible: objectif_position_1 > 15,
                                    attr: {
                                        y: this.settings.dataDisplay.bar_height + 16
                                    }
                                },
                                {
                                    id: "objectif_rectangle",
                                    visible: !!objectif_value_1,
                                    attr: {
                                        x1: objectif_position_1,
                                        x2: objectif_position_1,
                                        y2: this.settings.dataDisplay.bar_height,
                                        stroke: this.settings.dataDisplay.objectif_color
                                    }
                                },
                                {
                                    id: "objectif_triangle",
                                    visible: !!objectif_value_1,
                                    attr: {
                                        transform: function () {
                                            return "translate(" + objectif_position_1 + "," + (_settings_1.dataDisplay.bar_height + 2) + ")";
                                        },
                                        fill: this.settings.dataDisplay.objectif_color
                                    }
                                },
                                {
                                    id: "objectif_text",
                                    visible: !!objectif_value_1,
                                    value: function () {
                                        if (objectif_value_1) {
                                            var tmp = _settings_1.dataOption.prctMode && _settings_1.dataOption.prctMultiPlicateur ? objectif_value_1 * 100 : objectif_value_1;
                                            return _settings_1.dataDisplay.objectif_text + " " + tmp.toLocaleString() + prctsuffix_1;
                                        }
                                    },
                                    attr: {
                                        "text-anchor": objectif_position_1 < 100 ? "right" : "middle",
                                        fill: this.settings.dataDisplay.objectif_color,
                                        x: objectif_position_1,
                                        y: this.settings.dataDisplay.bar_height + svg_bottom_height - 4
                                    }
                                },
                                {
                                    id: "ptpassage_rectangle",
                                    visible: this.settings.dataOption.ptPassage && pt_passage_value_1,
                                    attr: {
                                        y2: this.settings.dataDisplay.bar_height + svg_bottom_height,
                                        x1: ptpassage_position_1,
                                        x2: ptpassage_position_1,
                                        stroke: this.settings.dataDisplay.ptpassage_color
                                    }
                                },
                                {
                                    id: "ptpassage_value",
                                    visible: this.settings.dataOption.ptPassage && pt_passage_value_1,
                                    value: function () {
                                        if (pt_passage_value_1) {
                                            var tmp = _settings_1.dataOption.prctMode && _settings_1.dataOption.prctMultiPlicateur ? pt_passage_value_1 * 100 : +pt_passage_value_1;
                                            return tmp.toLocaleString() + prctsuffix_1;
                                        }
                                    }
                                },
                                {
                                    id: "ptpassage_legend",
                                    visible: this.settings.dataOption.ptPassage && pt_passage_value_1,
                                    value: this.settings.dataDisplay.ptpassage_text
                                },
                                {
                                    id: "ptpassage_container",
                                    style: {
                                        color: this.settings.dataDisplay.ptpassage_color,
                                        "margin-left": function () {
                                            var ptpassage_container_position = ptpassage_position_1 - 150 / 2;
                                            ptpassage_container_position = ptpassage_container_position < 0 ? 0 : ptpassage_container_position;
                                            ptpassage_container_position = ptpassage_container_position > gwidth_1 - 150 / 2 ? gwidth_1 - 150 : ptpassage_container_position;
                                            return ptpassage_container_position + "px";
                                        }
                                    }
                                }];
                            this.engine.update(vm);
                        }
                        catch (ex) {
                            console.error('Update error', ex);
                        }
                    };
                    Visual.parseSettings = function (dataView) {
                        return pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.VisualSettings.parse(dataView);
                    };
                    Visual.getvalue = function (categorical, name) {
                        var item = categorical.values.filter(function (f) { return f.source.roles[name]; }).map(function (m) { return m.values[0]; });
                        if (item && item.length === 1) {
                            return item[0];
                        }
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        return pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.VisualSettings.enumerateObjectInstances(this.settings || pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.VisualSettings.getDefault(), options);
                    };
                    return Visual;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.Visual = Visual;
            })(pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 || (visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5_DEBUG = {
                name: 'pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5_DEBUG',
                displayName: 'flatprogress',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.11.0',
                create: function (options) { return new powerbi.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map