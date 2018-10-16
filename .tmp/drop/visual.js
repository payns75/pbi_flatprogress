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

// https://d3js.org/d3-selection/ Version 1.3.0. Copyright 2018 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.d3=t.d3||{})}(this,function(t){"use strict";function n(t){var n=t+="",e=n.indexOf(":");return e>=0&&"xmlns"!==(n=t.slice(0,e))&&(t=t.slice(e+1)),H.hasOwnProperty(n)?{space:H[n],local:t}:t}function e(t){var e=n(t);return(e.local?function(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}:function(t){return function(){var n=this.ownerDocument,e=this.namespaceURI;return e===z&&n.documentElement.namespaceURI===z?n.createElement(t):n.createElementNS(e,t)}})(e)}function r(){}function i(t){return null==t?r:function(){return this.querySelector(t)}}function o(){return[]}function u(t){return null==t?o:function(){return this.querySelectorAll(t)}}function c(t){return new Array(t.length)}function s(t,n){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=n}function a(t,n,e,r,i,o){for(var u,c=0,a=n.length,l=o.length;c<l;++c)(u=n[c])?(u.__data__=o[c],r[c]=u):e[c]=new s(t,o[c]);for(;c<a;++c)(u=n[c])&&(i[c]=u)}function l(t,n,e,r,i,o,u){var c,a,l,f={},h=n.length,p=o.length,_=new Array(h);for(c=0;c<h;++c)(a=n[c])&&(_[c]=l=X+u.call(a,a.__data__,c,n),l in f?i[c]=a:f[l]=a);for(c=0;c<p;++c)(a=f[l=X+u.call(t,o[c],c,o)])?(r[c]=a,a.__data__=o[c],f[l]=null):e[c]=new s(t,o[c]);for(c=0;c<h;++c)(a=n[c])&&f[_[c]]===a&&(i[c]=a)}function f(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}function h(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function p(t,n){return t.style.getPropertyValue(n)||h(t).getComputedStyle(t,null).getPropertyValue(n)}function _(t){return t.trim().split(/^|\s+/)}function d(t){return t.classList||new v(t)}function v(t){this._node=t,this._names=_(t.getAttribute("class")||"")}function m(t,n){for(var e=d(t),r=-1,i=n.length;++r<i;)e.add(n[r])}function y(t,n){for(var e=d(t),r=-1,i=n.length;++r<i;)e.remove(n[r])}function g(){this.textContent=""}function w(){this.innerHTML=""}function A(){this.nextSibling&&this.parentNode.appendChild(this)}function x(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function S(){return null}function b(){var t=this.parentNode;t&&t.removeChild(this)}function E(){return this.parentNode.insertBefore(this.cloneNode(!1),this.nextSibling)}function N(){return this.parentNode.insertBefore(this.cloneNode(!0),this.nextSibling)}function C(t,n,e){return t=P(t,n,e),function(n){var e=n.relatedTarget;e&&(e===this||8&e.compareDocumentPosition(this))||t.call(this,n)}}function P(n,e,r){return function(i){var o=t.event;t.event=i;try{n.call(this,this.__data__,e,r)}finally{t.event=o}}}function M(t){return function(){var n=this.__on;if(n){for(var e,r=0,i=-1,o=n.length;r<o;++r)e=n[r],t.type&&e.type!==t.type||e.name!==t.name?n[++i]=e:this.removeEventListener(e.type,e.listener,e.capture);++i?n.length=i:delete this.__on}}}function L(t,n,e){var r=Y.hasOwnProperty(t.type)?C:P;return function(i,o,u){var c,s=this.__on,a=r(n,o,u);if(s)for(var l=0,f=s.length;l<f;++l)if((c=s[l]).type===t.type&&c.name===t.name)return this.removeEventListener(c.type,c.listener,c.capture),this.addEventListener(c.type,c.listener=a,c.capture=e),void(c.value=n);this.addEventListener(t.type,a,e),c={type:t.type,name:t.name,value:n,listener:a,capture:e},s?s.push(c):this.__on=[c]}}function T(t,n,e){var r=h(t),i=r.CustomEvent;"function"==typeof i?i=new i(n,e):(i=r.document.createEvent("Event"),e?(i.initEvent(n,e.bubbles,e.cancelable),i.detail=e.detail):i.initEvent(n,!1,!1)),t.dispatchEvent(i)}function B(t,n){this._groups=t,this._parents=n}function q(){return new B([[document.documentElement]],$)}function O(t){return"string"==typeof t?new B([[document.querySelector(t)]],[document.documentElement]):new B([[t]],$)}function D(){return new V}function V(){this._="@"+(++F).toString(36)}function R(){for(var n,e=t.event;n=e.sourceEvent;)e=n;return e}function j(t,n){var e=t.ownerSVGElement||t;if(e.createSVGPoint){var r=e.createSVGPoint();return r.x=n.clientX,r.y=n.clientY,r=r.matrixTransform(t.getScreenCTM().inverse()),[r.x,r.y]}var i=t.getBoundingClientRect();return[n.clientX-i.left-t.clientLeft,n.clientY-i.top-t.clientTop]}var z="http://www.w3.org/1999/xhtml",H={svg:"http://www.w3.org/2000/svg",xhtml:z,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},I=function(t){return function(){return this.matches(t)}};if("undefined"!=typeof document){var U=document.documentElement;if(!U.matches){var k=U.webkitMatchesSelector||U.msMatchesSelector||U.mozMatchesSelector||U.oMatchesSelector;I=function(t){return function(){return k.call(this,t)}}}}var G=I;s.prototype={constructor:s,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,n){return this._parent.insertBefore(t,n)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};var X="$";v.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var n=this._names.indexOf(t);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var Y={};if(t.event=null,"undefined"!=typeof document){"onmouseenter"in document.documentElement||(Y={mouseenter:"mouseover",mouseleave:"mouseout"})}var $=[null];B.prototype=q.prototype={constructor:B,select:function(t){"function"!=typeof t&&(t=i(t));for(var n=this._groups,e=n.length,r=new Array(e),o=0;o<e;++o)for(var u,c,s=n[o],a=s.length,l=r[o]=new Array(a),f=0;f<a;++f)(u=s[f])&&(c=t.call(u,u.__data__,f,s))&&("__data__"in u&&(c.__data__=u.__data__),l[f]=c);return new B(r,this._parents)},selectAll:function(t){"function"!=typeof t&&(t=u(t));for(var n=this._groups,e=n.length,r=[],i=[],o=0;o<e;++o)for(var c,s=n[o],a=s.length,l=0;l<a;++l)(c=s[l])&&(r.push(t.call(c,c.__data__,l,s)),i.push(c));return new B(r,i)},filter:function(t){"function"!=typeof t&&(t=G(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u=n[i],c=u.length,s=r[i]=[],a=0;a<c;++a)(o=u[a])&&t.call(o,o.__data__,a,u)&&s.push(o);return new B(r,this._parents)},data:function(t,n){if(!t)return d=new Array(this.size()),f=-1,this.each(function(t){d[++f]=t}),d;var e=n?l:a,r=this._parents,i=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var o=i.length,u=new Array(o),c=new Array(o),s=new Array(o),f=0;f<o;++f){var h=r[f],p=i[f],_=p.length,d=t.call(h,h&&h.__data__,f,r),v=d.length,m=c[f]=new Array(v),y=u[f]=new Array(v);e(h,p,m,y,s[f]=new Array(_),d,n);for(var g,w,A=0,x=0;A<v;++A)if(g=m[A]){for(A>=x&&(x=A+1);!(w=y[x])&&++x<v;);g._next=w||null}}return u=new B(u,r),u._enter=c,u._exit=s,u},enter:function(){return new B(this._enter||this._groups.map(c),this._parents)},exit:function(){return new B(this._exit||this._groups.map(c),this._parents)},merge:function(t){for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),u=new Array(r),c=0;c<o;++c)for(var s,a=n[c],l=e[c],f=a.length,h=u[c]=new Array(f),p=0;p<f;++p)(s=a[p]||l[p])&&(h[p]=s);for(;c<r;++c)u[c]=n[c];return new B(u,this._parents)},order:function(){for(var t=this._groups,n=-1,e=t.length;++n<e;)for(var r,i=t[n],o=i.length-1,u=i[o];--o>=0;)(r=i[o])&&(u&&u!==r.nextSibling&&u.parentNode.insertBefore(r,u),u=r);return this},sort:function(t){function n(n,e){return n&&e?t(n.__data__,e.__data__):!n-!e}t||(t=f);for(var e=this._groups,r=e.length,i=new Array(r),o=0;o<r;++o){for(var u,c=e[o],s=c.length,a=i[o]=new Array(s),l=0;l<s;++l)(u=c[l])&&(a[l]=u);a.sort(n)}return new B(i,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){var t=new Array(this.size()),n=-1;return this.each(function(){t[++n]=this}),t},node:function(){for(var t=this._groups,n=0,e=t.length;n<e;++n)for(var r=t[n],i=0,o=r.length;i<o;++i){var u=r[i];if(u)return u}return null},size:function(){var t=0;return this.each(function(){++t}),t},empty:function(){return!this.node()},each:function(t){for(var n=this._groups,e=0,r=n.length;e<r;++e)for(var i,o=n[e],u=0,c=o.length;u<c;++u)(i=o[u])&&t.call(i,i.__data__,u,o);return this},attr:function(t,e){var r=n(t);if(arguments.length<2){var i=this.node();return r.local?i.getAttributeNS(r.space,r.local):i.getAttribute(r)}return this.each((null==e?r.local?function(t){return function(){this.removeAttributeNS(t.space,t.local)}}:function(t){return function(){this.removeAttribute(t)}}:"function"==typeof e?r.local?function(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,e)}}:function(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttribute(t):this.setAttribute(t,e)}}:r.local?function(t,n){return function(){this.setAttributeNS(t.space,t.local,n)}}:function(t,n){return function(){this.setAttribute(t,n)}})(r,e))},style:function(t,n,e){return arguments.length>1?this.each((null==n?function(t){return function(){this.style.removeProperty(t)}}:"function"==typeof n?function(t,n,e){return function(){var r=n.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,e)}}:function(t,n,e){return function(){this.style.setProperty(t,n,e)}})(t,n,null==e?"":e)):p(this.node(),t)},property:function(t,n){return arguments.length>1?this.each((null==n?function(t){return function(){delete this[t]}}:"function"==typeof n?function(t,n){return function(){var e=n.apply(this,arguments);null==e?delete this[t]:this[t]=e}}:function(t,n){return function(){this[t]=n}})(t,n)):this.node()[t]},classed:function(t,n){var e=_(t+"");if(arguments.length<2){for(var r=d(this.node()),i=-1,o=e.length;++i<o;)if(!r.contains(e[i]))return!1;return!0}return this.each(("function"==typeof n?function(t,n){return function(){(n.apply(this,arguments)?m:y)(this,t)}}:n?function(t){return function(){m(this,t)}}:function(t){return function(){y(this,t)}})(e,n))},text:function(t){return arguments.length?this.each(null==t?g:("function"==typeof t?function(t){return function(){var n=t.apply(this,arguments);this.textContent=null==n?"":n}}:function(t){return function(){this.textContent=t}})(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?w:("function"==typeof t?function(t){return function(){var n=t.apply(this,arguments);this.innerHTML=null==n?"":n}}:function(t){return function(){this.innerHTML=t}})(t)):this.node().innerHTML},raise:function(){return this.each(A)},lower:function(){return this.each(x)},append:function(t){var n="function"==typeof t?t:e(t);return this.select(function(){return this.appendChild(n.apply(this,arguments))})},insert:function(t,n){var r="function"==typeof t?t:e(t),o=null==n?S:"function"==typeof n?n:i(n);return this.select(function(){return this.insertBefore(r.apply(this,arguments),o.apply(this,arguments)||null)})},remove:function(){return this.each(b)},clone:function(t){return this.select(t?N:E)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,n,e){var r,i,o=function(t){return t.trim().split(/^|\s+/).map(function(t){var n="",e=t.indexOf(".");return e>=0&&(n=t.slice(e+1),t=t.slice(0,e)),{type:t,name:n}})}(t+""),u=o.length;if(!(arguments.length<2)){for(c=n?L:M,null==e&&(e=!1),r=0;r<u;++r)this.each(c(o[r],n,e));return this}var c=this.node().__on;if(c)for(var s,a=0,l=c.length;a<l;++a)for(r=0,s=c[a];r<u;++r)if((i=o[r]).type===s.type&&i.name===s.name)return s.value},dispatch:function(t,n){return this.each(("function"==typeof n?function(t,n){return function(){return T(this,t,n.apply(this,arguments))}}:function(t,n){return function(){return T(this,t,n)}})(t,n))}};var F=0;V.prototype=D.prototype={constructor:V,get:function(t){for(var n=this._;!(n in t);)if(!(t=t.parentNode))return;return t[n]},set:function(t,n){return t[this._]=n},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}},t.create=function(t){return O(e(t).call(document.documentElement))},t.creator=e,t.local=D,t.matcher=G,t.mouse=function(t){var n=R();return n.changedTouches&&(n=n.changedTouches[0]),j(t,n)},t.namespace=n,t.namespaces=H,t.clientPoint=j,t.select=O,t.selectAll=function(t){return"string"==typeof t?new B([document.querySelectorAll(t)],[document.documentElement]):new B([null==t?[]:t],$)},t.selection=q,t.selector=i,t.selectorAll=u,t.style=p,t.touch=function(t,n,e){arguments.length<3&&(e=n,n=R().changedTouches);for(var r,i=0,o=n?n.length:0;i<o;++i)if((r=n[i]).identifier===e)return j(t,r);return null},t.touches=function(t,n){null==n&&(n=R().touches);for(var e=0,r=n?n.length:0,i=new Array(r);e<r;++e)i[e]=j(t,n[e]);return i},t.window=h,t.customEvent=function(n,e,r,i){var o=t.event;n.sourceEvent=t.event,t.event=n;try{return e.apply(r,i)}finally{t.event=o}},Object.defineProperty(t,"__esModule",{value:!0})});
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
                    }
                    return dataDisplaySettings;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.dataDisplaySettings = dataDisplaySettings;
                var dataOptionSettings = (function () {
                    function dataOptionSettings() {
                        this.ptPassage = true;
                        this.prctMode = false;
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
                var Visual = (function () {
                    function Visual(options) {
                        var infos_container = document.createElement("div");
                        infos_container.className = "container";
                        var left_container = document.createElement("div");
                        left_container.className = "left_container";
                        var current_value = document.createElement("div");
                        current_value.className = "current_value";
                        this.value_text = current_value.appendChild(document.createTextNode(""));
                        left_container.appendChild(current_value);
                        var percent_value = document.createElement("div");
                        percent_value.className = "percent_value";
                        this.percent_text = percent_value.appendChild(document.createTextNode(""));
                        left_container.appendChild(percent_value);
                        this.right_container = document.createElement("div");
                        this.right_container.className = "none";
                        var reste_value = document.createElement("div");
                        reste_value.className = "reste_value";
                        this.reste_text = reste_value.appendChild(document.createTextNode(""));
                        this.right_container.appendChild(reste_value);
                        var reste_legend = document.createElement("div");
                        reste_legend.className = "reste_legend";
                        reste_legend.appendChild(document.createTextNode("Reste à faire"));
                        this.right_container.appendChild(reste_legend);
                        this.bottom_container = document.createElement("div");
                        this.bottom_container.className = "none";
                        var ptpassage_value = document.createElement("div");
                        ptpassage_value.className = "ptpassage_value";
                        this.ptpassage_text = ptpassage_value.appendChild(document.createTextNode("0"));
                        this.bottom_container.appendChild(ptpassage_value);
                        var ptpassage_legend = document.createElement("div");
                        ptpassage_legend.className = "ptpassage_legend";
                        ptpassage_legend.appendChild(document.createTextNode("Point de passage"));
                        this.bottom_container.appendChild(ptpassage_legend);
                        infos_container.appendChild(left_container);
                        infos_container.appendChild(this.right_container);
                        options.element.appendChild(infos_container);
                        this.svg = d3.select(options.element).append('svg').attr("height", 40);
                        options.element.appendChild(this.bottom_container);
                        this.gcontainer = this.svg.append('g').classed('percenter', true);
                        var bar_height = 20;
                        this.back_rectangle = this.gcontainer
                            .append('g')
                            .selectAll('rect')
                            .data([options.element.offsetWidth])
                            .enter()
                            .append("rect")
                            .attr("height", bar_height);
                        this.front_rectangle = this.gcontainer
                            .append('g')
                            .selectAll('rect')
                            .data([0])
                            .enter()
                            .append("rect")
                            .attr("height", bar_height);
                        this.objectif_rectangle = this.gcontainer
                            .append('g')
                            .selectAll('rect')
                            .data([0])
                            .enter()
                            .append("rect")
                            .attr("fill", "black")
                            .attr("height", bar_height)
                            .attr("width", 1)
                            .classed("none", true);
                        this.objectif_text = this.gcontainer
                            .append('g')
                            .selectAll('text')
                            .data([''])
                            .enter()
                            .append('text')
                            .attr("y", bar_height + 20);
                        this.zero_text = this.gcontainer
                            .append('g')
                            .append('text')
                            .text("0")
                            .attr("y", bar_height + 20)
                            .attr('text-anchor', 'right')
                            .classed("none", true);
                    }
                    Visual.prototype.update = function (options) {
                        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        var value = +Visual.getvalue(options.dataViews[0].categorical, "measure");
                        var objectif_value = +Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
                        var pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
                        this.svg.attr("width", options.viewport.width);
                        this.back_rectangle.data([options.viewport.width])
                            .attr("fill", this.settings.dataDisplay.backColor)
                            .attr("width", function (d) { return d; });
                        this.value_text.textContent = value.toLocaleString();
                        var value_position = options.viewport.width * value / 100 - options.viewport.width * 10 / 100;
                        if (objectif_value) {
                            this.right_container.className = "right_container";
                            this.reste_text.textContent = objectif_value - value > 0 ? (objectif_value - value).toLocaleString() : "0";
                            this.percent_text.textContent = (+(value / objectif_value * 100).toFixed(0)).toLocaleString() + "%";
                            var objectif_position = options.viewport.width * objectif_value / 100 - options.viewport.width * 10 / 100;
                            if (objectif_position < value_position) {
                                value_position = options.viewport.width - options.viewport.width * 10 / 100;
                                objectif_position = value_position * objectif_value / value;
                            }
                            else {
                                objectif_position = options.viewport.width - options.viewport.width * 10 / 100;
                                value_position = objectif_position * value / objectif_value;
                            }
                            this.front_rectangle.data([value_position])
                                .attr("fill", this.settings.dataDisplay.fill)
                                .attr("width", function (d) { return d; });
                            this.zero_text.classed("none", objectif_position < 15);
                            this.objectif_rectangle.classed("none", false);
                            this.objectif_rectangle.data([objectif_position])
                                .attr("x", function (d) { return d; });
                            this.objectif_text.data([objectif_value])
                                .attr("text-anchor", objectif_position < 50 ? "right" : "middle")
                                .text(function (d) { return d.toLocaleString(); })
                                .attr('x', objectif_position);
                            if (this.settings.dataOption.prctMode) {
                                this.right_container.className = "none";
                                this.percent_text.textContent = "";
                                this.objectif_text.text(this.objectif_text.text() + "%");
                                this.value_text.textContent += "%";
                            }
                        }
                        else {
                            this.front_rectangle.attr("width", "0");
                            this.zero_text.classed("none", true);
                            this.objectif_rectangle.classed("none", true);
                            this.right_container.className = "none";
                            this.objectif_text.text("");
                            this.percent_text.textContent = "";
                        }
                        this.bottom_container.className = this.settings.dataOption.ptPassage && pt_passage_value ? "container_bottom" : "none";
                        this.ptpassage_text.textContent = pt_passage_value.toLocaleString();
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
            plugins.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5 = {
                name: 'pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5',
                displayName: 'pbi_flatprogress_1_11',
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