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
// https://d3js.org/d3-shape/ Version 1.2.0. Copyright 2017 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-path")):"function"==typeof define&&define.amd?define(["exports","d3-path"],n):n(t.d3=t.d3||{},t.d3)}(this,function(t,n){"use strict";function i(t){return t>1?0:t<-1?lt:Math.acos(t)}function e(t){return t>=1?ut:t<=-1?-ut:Math.asin(t)}function s(t){return t.innerRadius}function h(t){return t.outerRadius}function o(t){return t.startAngle}function _(t){return t.endAngle}function r(t){return t&&t.padAngle}function a(t,n,i,e,s,h,o,_){var r=i-t,a=e-n,c=o-s,l=_-h,u=(c*(n-h)-l*(t-s))/(l*r-c*a);return[t+u*r,n+u*a]}function c(t,n,i,e,s,h,o){var _=t-i,r=n-e,a=(o?h:-h)/at(_*_+r*r),c=a*r,l=-a*_,u=t+c,f=n+l,x=i+c,y=e+l,p=(u+x)/2,v=(f+y)/2,d=x-u,T=y-f,g=d*d+T*T,b=s-h,w=u*y-x*f,k=(T<0?-1:1)*at(ot(0,b*b*g-w*w)),m=(w*T-d*k)/g,N=(-w*d-T*k)/g,M=(w*T+d*k)/g,S=(-w*d+T*k)/g,E=m-p,A=N-v,P=M-p,C=S-v;return E*E+A*A>P*P+C*C&&(m=M,N=S),{cx:m,cy:N,x01:-c,y01:-l,x11:m*(s/b-1),y11:N*(s/b-1)}}function l(t){this._context=t}function u(t){return t[0]}function f(t){return t[1]}function x(t){this._curve=t}function y(t){function n(n){return new x(t(n))}return n._curve=t,n}function p(t){var n=t.curve;return t.angle=t.x,delete t.x,t.radius=t.y,delete t.y,t.curve=function(t){return arguments.length?n(y(t)):n()._curve},t}function v(t){return t.source}function d(t){return t.target}function T(t){function i(){var i,r=Nt.call(arguments),a=e.apply(this,r),c=s.apply(this,r);if(_||(_=i=n.path()),t(_,+h.apply(this,(r[0]=a,r)),+o.apply(this,r),+h.apply(this,(r[0]=c,r)),+o.apply(this,r)),i)return _=null,i+""||null}var e=v,s=d,h=u,o=f,_=null;return i.source=function(t){return arguments.length?(e=t,i):e},i.target=function(t){return arguments.length?(s=t,i):s},i.x=function(t){return arguments.length?(h="function"==typeof t?t:it(+t),i):h},i.y=function(t){return arguments.length?(o="function"==typeof t?t:it(+t),i):o},i.context=function(t){return arguments.length?(_=null==t?null:t,i):_},i}function g(t,n,i,e,s){t.moveTo(n,i),t.bezierCurveTo(n=(n+e)/2,i,n,s,e,s)}function b(t,n,i,e,s){t.moveTo(n,i),t.bezierCurveTo(n,i=(i+s)/2,e,i,e,s)}function w(t,n,i,e,s){var h=mt(n,i),o=mt(n,i=(i+s)/2),_=mt(e,i),r=mt(e,s);t.moveTo(h[0],h[1]),t.bezierCurveTo(o[0],o[1],_[0],_[1],r[0],r[1])}function k(){return T(g)}function m(){return T(b)}function N(){var t=T(w);return t.angle=t.x,delete t.x,t.radius=t.y,delete t.y,t}function M(t,n,i){t._context.bezierCurveTo((2*t._x0+t._x1)/3,(2*t._y0+t._y1)/3,(t._x0+2*t._x1)/3,(t._y0+2*t._y1)/3,(t._x0+4*t._x1+n)/6,(t._y0+4*t._y1+i)/6)}function S(t){this._context=t}function E(t){this._context=t}function A(t){this._context=t}function P(t,n){this._basis=new S(t),this._beta=n}function C(t,n,i){t._context.bezierCurveTo(t._x1+t._k*(t._x2-t._x0),t._y1+t._k*(t._y2-t._y0),t._x2+t._k*(t._x1-n),t._y2+t._k*(t._y1-i),t._x2,t._y2)}function R(t,n){this._context=t,this._k=(1-n)/6}function q(t,n){this._context=t,this._k=(1-n)/6}function O(t,n){this._context=t,this._k=(1-n)/6}function z(t,n,i){var e=t._x1,s=t._y1,h=t._x2,o=t._y2;if(t._l01_a>ct){var _=2*t._l01_2a+3*t._l01_a*t._l12_a+t._l12_2a,r=3*t._l01_a*(t._l01_a+t._l12_a);e=(e*_-t._x0*t._l12_2a+t._x2*t._l01_2a)/r,s=(s*_-t._y0*t._l12_2a+t._y2*t._l01_2a)/r}if(t._l23_a>ct){var a=2*t._l23_2a+3*t._l23_a*t._l12_a+t._l12_2a,c=3*t._l23_a*(t._l23_a+t._l12_a);h=(h*a+t._x1*t._l23_2a-n*t._l12_2a)/c,o=(o*a+t._y1*t._l23_2a-i*t._l12_2a)/c}t._context.bezierCurveTo(e,s,h,o,t._x2,t._y2)}function X(t,n){this._context=t,this._alpha=n}function Y(t,n){this._context=t,this._alpha=n}function B(t,n){this._context=t,this._alpha=n}function I(t){this._context=t}function j(t){return t<0?-1:1}function D(t,n,i){var e=t._x1-t._x0,s=n-t._x1,h=(t._y1-t._y0)/(e||s<0&&-0),o=(i-t._y1)/(s||e<0&&-0),_=(h*s+o*e)/(e+s);return(j(h)+j(o))*Math.min(Math.abs(h),Math.abs(o),.5*Math.abs(_))||0}function L(t,n){var i=t._x1-t._x0;return i?(3*(t._y1-t._y0)/i-n)/2:n}function V(t,n,i){var e=t._x0,s=t._y0,h=t._x1,o=t._y1,_=(h-e)/3;t._context.bezierCurveTo(e+_,s+_*n,h-_,o-_*i,h,o)}function W(t){this._context=t}function H(t){this._context=new F(t)}function F(t){this._context=t}function G(t){return new W(t)}function J(t){return new H(t)}function K(t){this._context=t}function Q(t){var n,i,e=t.length-1,s=new Array(e),h=new Array(e),o=new Array(e);for(s[0]=0,h[0]=2,o[0]=t[0]+2*t[1],n=1;n<e-1;++n)s[n]=1,h[n]=4,o[n]=4*t[n]+2*t[n+1];for(s[e-1]=2,h[e-1]=7,o[e-1]=8*t[e-1]+t[e],n=1;n<e;++n)i=s[n]/h[n-1],h[n]-=i,o[n]-=i*o[n-1];for(s[e-1]=o[e-1]/h[e-1],n=e-2;n>=0;--n)s[n]=(o[n]-s[n+1])/h[n];for(h[e-1]=(t[e]+s[e-1])/2,n=0;n<e-1;++n)h[n]=2*t[n+1]-s[n+1];return[s,h]}function U(t,n){this._context=t,this._t=n}function Z(t){return new U(t,0)}function $(t){return new U(t,1)}function tt(t,n){return t[n]}function nt(t){for(var n,i=0,e=-1,s=t.length;++e<s;)(n=+t[e][1])&&(i+=n);return i}var it=function(t){return function(){return t}},et=Math.abs,st=Math.atan2,ht=Math.cos,ot=Math.max,_t=Math.min,rt=Math.sin,at=Math.sqrt,ct=1e-12,lt=Math.PI,ut=lt/2,ft=2*lt,xt=function(){function t(){var t,s,h=+l.apply(this,arguments),o=+u.apply(this,arguments),_=y.apply(this,arguments)-ut,r=p.apply(this,arguments)-ut,T=et(r-_),g=r>_;if(d||(d=t=n.path()),o<h&&(s=o,o=h,h=s),o>ct)if(T>ft-ct)d.moveTo(o*ht(_),o*rt(_)),d.arc(0,0,o,_,r,!g),h>ct&&(d.moveTo(h*ht(r),h*rt(r)),d.arc(0,0,h,r,_,g));else{var b,w,k=_,m=r,N=_,M=r,S=T,E=T,A=v.apply(this,arguments)/2,P=A>ct&&(x?+x.apply(this,arguments):at(h*h+o*o)),C=_t(et(o-h)/2,+f.apply(this,arguments)),R=C,q=C;if(P>ct){var O=e(P/h*rt(A)),z=e(P/o*rt(A));(S-=2*O)>ct?(O*=g?1:-1,N+=O,M-=O):(S=0,N=M=(_+r)/2),(E-=2*z)>ct?(z*=g?1:-1,k+=z,m-=z):(E=0,k=m=(_+r)/2)}var X=o*ht(k),Y=o*rt(k),B=h*ht(M),I=h*rt(M);if(C>ct){var j=o*ht(m),D=o*rt(m),L=h*ht(N),V=h*rt(N);if(T<lt){var W=S>ct?a(X,Y,L,V,j,D,B,I):[B,I],H=X-W[0],F=Y-W[1],G=j-W[0],J=D-W[1],K=1/rt(i((H*G+F*J)/(at(H*H+F*F)*at(G*G+J*J)))/2),Q=at(W[0]*W[0]+W[1]*W[1]);R=_t(C,(h-Q)/(K-1)),q=_t(C,(o-Q)/(K+1))}}E>ct?q>ct?(b=c(L,V,X,Y,o,q,g),w=c(j,D,B,I,o,q,g),d.moveTo(b.cx+b.x01,b.cy+b.y01),q<C?d.arc(b.cx,b.cy,q,st(b.y01,b.x01),st(w.y01,w.x01),!g):(d.arc(b.cx,b.cy,q,st(b.y01,b.x01),st(b.y11,b.x11),!g),d.arc(0,0,o,st(b.cy+b.y11,b.cx+b.x11),st(w.cy+w.y11,w.cx+w.x11),!g),d.arc(w.cx,w.cy,q,st(w.y11,w.x11),st(w.y01,w.x01),!g))):(d.moveTo(X,Y),d.arc(0,0,o,k,m,!g)):d.moveTo(X,Y),h>ct&&S>ct?R>ct?(b=c(B,I,j,D,h,-R,g),w=c(X,Y,L,V,h,-R,g),d.lineTo(b.cx+b.x01,b.cy+b.y01),R<C?d.arc(b.cx,b.cy,R,st(b.y01,b.x01),st(w.y01,w.x01),!g):(d.arc(b.cx,b.cy,R,st(b.y01,b.x01),st(b.y11,b.x11),!g),d.arc(0,0,h,st(b.cy+b.y11,b.cx+b.x11),st(w.cy+w.y11,w.cx+w.x11),g),d.arc(w.cx,w.cy,R,st(w.y11,w.x11),st(w.y01,w.x01),!g))):d.arc(0,0,h,M,N,g):d.lineTo(B,I)}else d.moveTo(0,0);if(d.closePath(),t)return d=null,t+""||null}var l=s,u=h,f=it(0),x=null,y=o,p=_,v=r,d=null;return t.centroid=function(){var t=(+l.apply(this,arguments)+ +u.apply(this,arguments))/2,n=(+y.apply(this,arguments)+ +p.apply(this,arguments))/2-lt/2;return[ht(n)*t,rt(n)*t]},t.innerRadius=function(n){return arguments.length?(l="function"==typeof n?n:it(+n),t):l},t.outerRadius=function(n){return arguments.length?(u="function"==typeof n?n:it(+n),t):u},t.cornerRadius=function(n){return arguments.length?(f="function"==typeof n?n:it(+n),t):f},t.padRadius=function(n){return arguments.length?(x=null==n?null:"function"==typeof n?n:it(+n),t):x},t.startAngle=function(n){return arguments.length?(y="function"==typeof n?n:it(+n),t):y},t.endAngle=function(n){return arguments.length?(p="function"==typeof n?n:it(+n),t):p},t.padAngle=function(n){return arguments.length?(v="function"==typeof n?n:it(+n),t):v},t.context=function(n){return arguments.length?(d=null==n?null:n,t):d},t};l.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:this._context.lineTo(t,n)}}};var yt=function(t){return new l(t)},pt=function(){function t(t){var r,a,c,l=t.length,u=!1;for(null==h&&(_=o(c=n.path())),r=0;r<=l;++r)!(r<l&&s(a=t[r],r,t))===u&&((u=!u)?_.lineStart():_.lineEnd()),u&&_.point(+i(a,r,t),+e(a,r,t));if(c)return _=null,c+""||null}var i=u,e=f,s=it(!0),h=null,o=yt,_=null;return t.x=function(n){return arguments.length?(i="function"==typeof n?n:it(+n),t):i},t.y=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.defined=function(n){return arguments.length?(s="function"==typeof n?n:it(!!n),t):s},t.curve=function(n){return arguments.length?(o=n,null!=h&&(_=o(h)),t):o},t.context=function(n){return arguments.length?(null==n?h=_=null:_=o(h=n),t):h},t},vt=function(){function t(t){var i,l,u,f,x,y=t.length,p=!1,v=new Array(y),d=new Array(y);for(null==r&&(c=a(x=n.path())),i=0;i<=y;++i){if(!(i<y&&_(f=t[i],i,t))===p)if(p=!p)l=i,c.areaStart(),c.lineStart();else{for(c.lineEnd(),c.lineStart(),u=i-1;u>=l;--u)c.point(v[u],d[u]);c.lineEnd(),c.areaEnd()}p&&(v[i]=+e(f,i,t),d[i]=+h(f,i,t),c.point(s?+s(f,i,t):v[i],o?+o(f,i,t):d[i]))}if(x)return c=null,x+""||null}function i(){return pt().defined(_).curve(a).context(r)}var e=u,s=null,h=it(0),o=f,_=it(!0),r=null,a=yt,c=null;return t.x=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),s=null,t):e},t.x0=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.x1=function(n){return arguments.length?(s=null==n?null:"function"==typeof n?n:it(+n),t):s},t.y=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),o=null,t):h},t.y0=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),t):h},t.y1=function(n){return arguments.length?(o=null==n?null:"function"==typeof n?n:it(+n),t):o},t.lineX0=t.lineY0=function(){return i().x(e).y(h)},t.lineY1=function(){return i().x(e).y(o)},t.lineX1=function(){return i().x(s).y(h)},t.defined=function(n){return arguments.length?(_="function"==typeof n?n:it(!!n),t):_},t.curve=function(n){return arguments.length?(a=n,null!=r&&(c=a(r)),t):a},t.context=function(n){return arguments.length?(null==n?r=c=null:c=a(r=n),t):r},t},dt=function(t,n){return n<t?-1:n>t?1:n>=t?0:NaN},Tt=function(t){return t},gt=function(){function t(t){var _,r,a,c,l,u=t.length,f=0,x=new Array(u),y=new Array(u),p=+s.apply(this,arguments),v=Math.min(ft,Math.max(-ft,h.apply(this,arguments)-p)),d=Math.min(Math.abs(v)/u,o.apply(this,arguments)),T=d*(v<0?-1:1);for(_=0;_<u;++_)(l=y[x[_]=_]=+n(t[_],_,t))>0&&(f+=l);for(null!=i?x.sort(function(t,n){return i(y[t],y[n])}):null!=e&&x.sort(function(n,i){return e(t[n],t[i])}),_=0,a=f?(v-u*T)/f:0;_<u;++_,p=c)r=x[_],l=y[r],c=p+(l>0?l*a:0)+T,y[r]={data:t[r],index:_,value:l,startAngle:p,endAngle:c,padAngle:d};return y}var n=Tt,i=dt,e=null,s=it(0),h=it(ft),o=it(0);return t.value=function(i){return arguments.length?(n="function"==typeof i?i:it(+i),t):n},t.sortValues=function(n){return arguments.length?(i=n,e=null,t):i},t.sort=function(n){return arguments.length?(e=n,i=null,t):e},t.startAngle=function(n){return arguments.length?(s="function"==typeof n?n:it(+n),t):s},t.endAngle=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),t):h},t.padAngle=function(n){return arguments.length?(o="function"==typeof n?n:it(+n),t):o},t},bt=y(yt);x.prototype={areaStart:function(){this._curve.areaStart()},areaEnd:function(){this._curve.areaEnd()},lineStart:function(){this._curve.lineStart()},lineEnd:function(){this._curve.lineEnd()},point:function(t,n){this._curve.point(n*Math.sin(t),n*-Math.cos(t))}};var wt=function(){return p(pt().curve(bt))},kt=function(){var t=vt().curve(bt),n=t.curve,i=t.lineX0,e=t.lineX1,s=t.lineY0,h=t.lineY1;return t.angle=t.x,delete t.x,t.startAngle=t.x0,delete t.x0,t.endAngle=t.x1,delete t.x1,t.radius=t.y,delete t.y,t.innerRadius=t.y0,delete t.y0,t.outerRadius=t.y1,delete t.y1,t.lineStartAngle=function(){return p(i())},delete t.lineX0,t.lineEndAngle=function(){return p(e())},delete t.lineX1,t.lineInnerRadius=function(){return p(s())},delete t.lineY0,t.lineOuterRadius=function(){return p(h())},delete t.lineY1,t.curve=function(t){return arguments.length?n(y(t)):n()._curve},t},mt=function(t,n){return[(n=+n)*Math.cos(t-=Math.PI/2),n*Math.sin(t)]},Nt=Array.prototype.slice,Mt={draw:function(t,n){var i=Math.sqrt(n/lt);t.moveTo(i,0),t.arc(0,0,i,0,ft)}},St={draw:function(t,n){var i=Math.sqrt(n/5)/2;t.moveTo(-3*i,-i),t.lineTo(-i,-i),t.lineTo(-i,-3*i),t.lineTo(i,-3*i),t.lineTo(i,-i),t.lineTo(3*i,-i),t.lineTo(3*i,i),t.lineTo(i,i),t.lineTo(i,3*i),t.lineTo(-i,3*i),t.lineTo(-i,i),t.lineTo(-3*i,i),t.closePath()}},Et=Math.sqrt(1/3),At=2*Et,Pt={draw:function(t,n){var i=Math.sqrt(n/At),e=i*Et;t.moveTo(0,-i),t.lineTo(e,0),t.lineTo(0,i),t.lineTo(-e,0),t.closePath()}},Ct=Math.sin(lt/10)/Math.sin(7*lt/10),Rt=Math.sin(ft/10)*Ct,qt=-Math.cos(ft/10)*Ct,Ot={draw:function(t,n){var i=Math.sqrt(.8908130915292852*n),e=Rt*i,s=qt*i;t.moveTo(0,-i),t.lineTo(e,s);for(var h=1;h<5;++h){var o=ft*h/5,_=Math.cos(o),r=Math.sin(o);t.lineTo(r*i,-_*i),t.lineTo(_*e-r*s,r*e+_*s)}t.closePath()}},zt={draw:function(t,n){var i=Math.sqrt(n),e=-i/2;t.rect(e,e,i,i)}},Xt=Math.sqrt(3),Yt={draw:function(t,n){var i=-Math.sqrt(n/(3*Xt));t.moveTo(0,2*i),t.lineTo(-Xt*i,-i),t.lineTo(Xt*i,-i),t.closePath()}},Bt=-.5,It=Math.sqrt(3)/2,jt=1/Math.sqrt(12),Dt=3*(jt/2+1),Lt={draw:function(t,n){var i=Math.sqrt(n/Dt),e=i/2,s=i*jt,h=e,o=i*jt+i,_=-h,r=o;t.moveTo(e,s),t.lineTo(h,o),t.lineTo(_,r),t.lineTo(Bt*e-It*s,It*e+Bt*s),t.lineTo(Bt*h-It*o,It*h+Bt*o),t.lineTo(Bt*_-It*r,It*_+Bt*r),t.lineTo(Bt*e+It*s,Bt*s-It*e),t.lineTo(Bt*h+It*o,Bt*o-It*h),t.lineTo(Bt*_+It*r,Bt*r-It*_),t.closePath()}},Vt=[Mt,St,Pt,zt,Ot,Yt,Lt],Wt=function(){function t(){var t;if(s||(s=t=n.path()),i.apply(this,arguments).draw(s,+e.apply(this,arguments)),t)return s=null,t+""||null}var i=it(Mt),e=it(64),s=null;return t.type=function(n){return arguments.length?(i="function"==typeof n?n:it(n),t):i},t.size=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.context=function(n){return arguments.length?(s=null==n?null:n,t):s},t},Ht=function(){};S.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){switch(this._point){case 3:M(this,this._x1,this._y1);case 2:this._context.lineTo(this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,this._context.lineTo((5*this._x0+this._x1)/6,(5*this._y0+this._y1)/6);default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Ft=function(t){return new S(t)};E.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._y0=this._y1=this._y2=this._y3=this._y4=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x2,this._y2),this._context.closePath();break;case 2:this._context.moveTo((this._x2+2*this._x3)/3,(this._y2+2*this._y3)/3),this._context.lineTo((this._x3+2*this._x2)/3,(this._y3+2*this._y2)/3),this._context.closePath();break;case 3:this.point(this._x2,this._y2),this.point(this._x3,this._y3),this.point(this._x4,this._y4)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x2=t,this._y2=n;break;case 1:this._point=2,this._x3=t,this._y3=n;break;case 2:this._point=3,this._x4=t,this._y4=n,this._context.moveTo((this._x0+4*this._x1+t)/6,(this._y0+4*this._y1+n)/6);break;default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Gt=function(t){return new E(t)};A.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3;var i=(this._x0+4*this._x1+t)/6,e=(this._y0+4*this._y1+n)/6;this._line?this._context.lineTo(i,e):this._context.moveTo(i,e);break;case 3:this._point=4;default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Jt=function(t){return new A(t)};P.prototype={lineStart:function(){this._x=[],this._y=[],this._basis.lineStart()},lineEnd:function(){var t=this._x,n=this._y,i=t.length-1;if(i>0)for(var e,s=t[0],h=n[0],o=t[i]-s,_=n[i]-h,r=-1;++r<=i;)e=r/i,this._basis.point(this._beta*t[r]+(1-this._beta)*(s+e*o),this._beta*n[r]+(1-this._beta)*(h+e*_));this._x=this._y=null,this._basis.lineEnd()},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var Kt=function t(n){function i(t){return 1===n?new S(t):new P(t,n)}return i.beta=function(n){return t(+n)},i}(.85);R.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:C(this,this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2,this._x1=t,this._y1=n;break;case 2:this._point=3;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Qt=function t(n){function i(t){return new R(t,n)}return i.tension=function(n){return t(+n)},i}(0);q.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Ut=function t(n){function i(t){return new q(t,n)}return i.tension=function(n){return t(+n)},i}(0);O.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Zt=function t(n){function i(t){return new O(t,n)}return i.tension=function(n){return t(+n)},i}(0);X.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:this.point(this._x2,this._y2)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var $t=function t(n){function i(t){return n?new X(t,n):new R(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);Y.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var tn=function t(n){function i(t){return n?new Y(t,n):new q(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);B.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var nn=function t(n){function i(t){return n?new B(t,n):new O(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);I.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._point=0},lineEnd:function(){this._point&&this._context.closePath()},point:function(t,n){t=+t,n=+n,this._point?this._context.lineTo(t,n):(this._point=1,this._context.moveTo(t,n))}};var en=function(t){return new I(t)};W.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=this._t0=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x1,this._y1);break;case 3:V(this,this._t0,L(this,this._t0))}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){var i=NaN;if(t=+t,n=+n,t!==this._x1||n!==this._y1){switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,V(this,L(this,i=D(this,t,n)),i);break;default:V(this,this._t0,i=D(this,t,n))}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n,this._t0=i}}},(H.prototype=Object.create(W.prototype)).point=function(t,n){W.prototype.point.call(this,n,t)},F.prototype={moveTo:function(t,n){this._context.moveTo(n,t)},closePath:function(){this._context.closePath()},lineTo:function(t,n){this._context.lineTo(n,t)},bezierCurveTo:function(t,n,i,e,s,h){this._context.bezierCurveTo(n,t,e,i,h,s)}},K.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=[],this._y=[]},lineEnd:function(){var t=this._x,n=this._y,i=t.length;if(i)if(this._line?this._context.lineTo(t[0],n[0]):this._context.moveTo(t[0],n[0]),2===i)this._context.lineTo(t[1],n[1]);else for(var e=Q(t),s=Q(n),h=0,o=1;o<i;++h,++o)this._context.bezierCurveTo(e[0][h],s[0][h],e[1][h],s[1][h],t[o],n[o]);(this._line||0!==this._line&&1===i)&&this._context.closePath(),this._line=1-this._line,this._x=this._y=null},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var sn=function(t){return new K(t)};U.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&2===this._point&&this._context.lineTo(this._x,this._y),(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:if(this._t<=0)this._context.lineTo(this._x,n),this._context.lineTo(t,n);else{var i=this._x*(1-this._t)+t*this._t;this._context.lineTo(i,this._y),this._context.lineTo(i,n)}}this._x=t,this._y=n}};var hn=function(t){return new U(t,.5)},on=function(t,n){if((s=t.length)>1)for(var i,e,s,h=1,o=t[n[0]],_=o.length;h<s;++h)for(e=o,o=t[n[h]],i=0;i<_;++i)o[i][1]+=o[i][0]=isNaN(e[i][1])?e[i][0]:e[i][1]},_n=function(t){for(var n=t.length,i=new Array(n);--n>=0;)i[n]=n;return i},rn=function(){function t(t){var h,o,_=n.apply(this,arguments),r=t.length,a=_.length,c=new Array(a);for(h=0;h<a;++h){for(var l,u=_[h],f=c[h]=new Array(r),x=0;x<r;++x)f[x]=l=[0,+s(t[x],u,x,t)],l.data=t[x];f.key=u}for(h=0,o=i(c);h<a;++h)c[o[h]].index=h;return e(c,o),c}var n=it([]),i=_n,e=on,s=tt;return t.keys=function(i){return arguments.length?(n="function"==typeof i?i:it(Nt.call(i)),t):n},t.value=function(n){return arguments.length?(s="function"==typeof n?n:it(+n),t):s},t.order=function(n){return arguments.length?(i=null==n?_n:"function"==typeof n?n:it(Nt.call(n)),t):i},t.offset=function(n){return arguments.length?(e=null==n?on:n,t):e},t},an=function(t,n){if((e=t.length)>0){for(var i,e,s,h=0,o=t[0].length;h<o;++h){for(s=i=0;i<e;++i)s+=t[i][h][1]||0;if(s)for(i=0;i<e;++i)t[i][h][1]/=s}on(t,n)}},cn=function(t,n){if((_=t.length)>1)for(var i,e,s,h,o,_,r=0,a=t[n[0]].length;r<a;++r)for(h=o=0,i=0;i<_;++i)(s=(e=t[n[i]][r])[1]-e[0])>=0?(e[0]=h,e[1]=h+=s):s<0?(e[1]=o,e[0]=o+=s):e[0]=h},ln=function(t,n){if((i=t.length)>0){for(var i,e=0,s=t[n[0]],h=s.length;e<h;++e){for(var o=0,_=0;o<i;++o)_+=t[o][e][1]||0;s[e][1]+=s[e][0]=-_/2}on(t,n)}},un=function(t,n){if((s=t.length)>0&&(e=(i=t[n[0]]).length)>0){for(var i,e,s,h=0,o=1;o<e;++o){for(var _=0,r=0,a=0;_<s;++_){for(var c=t[n[_]],l=c[o][1]||0,u=c[o-1][1]||0,f=(l-u)/2,x=0;x<_;++x){var y=t[n[x]];f+=(y[o][1]||0)-(y[o-1][1]||0)}r+=l,a+=f*l}i[o-1][1]+=i[o-1][0]=h,r&&(h-=a/r)}i[o-1][1]+=i[o-1][0]=h,on(t,n)}},fn=function(t){var n=t.map(nt);return _n(t).sort(function(t,i){return n[t]-n[i]})},xn=function(t){return fn(t).reverse()},yn=function(t){var n,i,e=t.length,s=t.map(nt),h=_n(t).sort(function(t,n){return s[n]-s[t]}),o=0,_=0,r=[],a=[];for(n=0;n<e;++n)i=h[n],o<_?(o+=s[i],r.push(i)):(_+=s[i],a.push(i));return a.reverse().concat(r)},pn=function(t){return _n(t).reverse()};t.arc=xt,t.area=vt,t.line=pt,t.pie=gt,t.areaRadial=kt,t.radialArea=kt,t.lineRadial=wt,t.radialLine=wt,t.pointRadial=mt,t.linkHorizontal=k,t.linkVertical=m,t.linkRadial=N,t.symbol=Wt,t.symbols=Vt,t.symbolCircle=Mt,t.symbolCross=St,t.symbolDiamond=Pt,t.symbolSquare=zt,t.symbolStar=Ot,t.symbolTriangle=Yt,t.symbolWye=Lt,t.curveBasisClosed=Gt,t.curveBasisOpen=Jt,t.curveBasis=Ft,t.curveBundle=Kt,t.curveCardinalClosed=Ut,t.curveCardinalOpen=Zt,t.curveCardinal=Qt,t.curveCatmullRomClosed=tn,t.curveCatmullRomOpen=nn,t.curveCatmullRom=$t,t.curveLinearClosed=en,t.curveLinear=yt,t.curveMonotoneX=G,t.curveMonotoneY=J,t.curveNatural=sn,t.curveStep=hn,t.curveStepAfter=$,t.curveStepBefore=Z,t.stack=rn,t.stackOffsetExpand=an,t.stackOffsetDiverging=cn,t.stackOffsetNone=on,t.stackOffsetSilhouette=ln,t.stackOffsetWiggle=un,t.stackOrderAscending=fn,t.stackOrderDescending=xn,t.stackOrderInsideOut=yn,t.stackOrderNone=_n,t.stackOrderReverse=pn,Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-path/ Version 1.0.5. Copyright 2017 Mike Bostock.
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(t.d3=t.d3||{})}(this,function(t){"use strict";function i(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function s(){return new i}var h=Math.PI,_=2*h,e=_-1e-6;i.prototype=s.prototype={constructor:i,moveTo:function(t,i){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,i){this._+="L"+(this._x1=+t)+","+(this._y1=+i)},quadraticCurveTo:function(t,i,s,h){this._+="Q"+ +t+","+ +i+","+(this._x1=+s)+","+(this._y1=+h)},bezierCurveTo:function(t,i,s,h,_,e){this._+="C"+ +t+","+ +i+","+ +s+","+ +h+","+(this._x1=+_)+","+(this._y1=+e)},arcTo:function(t,i,s,_,e){t=+t,i=+i,s=+s,_=+_,e=+e;var n=this._x1,o=this._y1,r=s-t,a=_-i,u=n-t,c=o-i,f=u*u+c*c;if(e<0)throw new Error("negative radius: "+e);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=i);else if(f>1e-6)if(Math.abs(c*r-a*u)>1e-6&&e){var x=s-n,y=_-o,M=r*r+a*a,l=x*x+y*y,d=Math.sqrt(M),p=Math.sqrt(f),v=e*Math.tan((h-Math.acos((M+f-l)/(2*d*p)))/2),b=v/p,w=v/d;Math.abs(b-1)>1e-6&&(this._+="L"+(t+b*u)+","+(i+b*c)),this._+="A"+e+","+e+",0,0,"+ +(c*x>u*y)+","+(this._x1=t+w*r)+","+(this._y1=i+w*a)}else this._+="L"+(this._x1=t)+","+(this._y1=i);else;},arc:function(t,i,s,n,o,r){t=+t,i=+i,s=+s;var a=s*Math.cos(n),u=s*Math.sin(n),c=t+a,f=i+u,x=1^r,y=r?n-o:o-n;if(s<0)throw new Error("negative radius: "+s);null===this._x1?this._+="M"+c+","+f:(Math.abs(this._x1-c)>1e-6||Math.abs(this._y1-f)>1e-6)&&(this._+="L"+c+","+f),s&&(y<0&&(y=y%_+_),y>e?this._+="A"+s+","+s+",0,1,"+x+","+(t-a)+","+(i-u)+"A"+s+","+s+",0,1,"+x+","+(this._x1=c)+","+(this._y1=f):y>1e-6&&(this._+="A"+s+","+s+",0,"+ +(y>=h)+","+x+","+(this._x1=t+s*Math.cos(o))+","+(this._y1=i+s*Math.sin(o))))},rect:function(t,i,s,h){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)+"h"+ +s+"v"+ +h+"h"+-s+"Z"},toString:function(){return this._}},t.path=s,Object.defineProperty(t,"__esModule",{value:!0})});
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
                var DomManipulation = (function () {
                    function DomManipulation(element) {
                        this.element = element;
                        this.data = {};
                        this.getvalue = function (item, name) {
                            return item[name] && typeof (item[name]) === "function" ? item[name]() : item[name];
                        };
                        var nodes = element.querySelectorAll("*");
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].id) {
                                this.data[nodes[i].id] = nodes[i];
                            }
                        }
                    }
                    DomManipulation.prototype.update = function (vm) {
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
                    return DomManipulation;
                }());
                pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.DomManipulation = DomManipulation;
                var Visual = (function () {
                    function Visual(options) {
                        this.visual_top = document.createElement("div");
                        this.visual_top.className = "visual_top";
                        options.element.appendChild(this.visual_top);
                        // const infos_container: HTMLElement = document.createElement("div");
                        // infos_container.className = "container";
                        var infos_container_html = "\n                <div class=\"container\">\n                    <div class=\"left_container\">\n                        <div class=\"current_value_container\">\n                            <div id=\"current_value_libelle\" class=\"current_value_libelle\"></div>\n                            <div id=\"current_value\" class=\"current_value\"></div>\n                        </div>\n                        <div id=\"percent_value\" class=\"percent_value\"></div>\n                    </div>\n                    <div class=\"right_container\">\n                        <div id=\"reste_value\" class=\"reste_value\"></div>\n                        <div id=\"reste_legend\" class=\"reste_legend\"></div>\n                    </div>\n                </div>\n                <svg id=\"svg\">\n                    <rect id=\"back_rectangle\"></rect>\n                    <rect id=\"front_rectangle\"></rect>\n                    <line id=\"objectif_rectangle\" width=\"3\" y1=\"0\" stroke-width=\"1\"></line>\n                    <text id=\"zero_text\" text-anchor=\"right\">0</text>\n                    <polygon id=\"objectif_triangle\" points=\"0 0,7 10,-7 10\"></polygon>\n                    <text id=\"objectif_text\"></text>\n                    <line id=\"ptpassage_rectangle\" y1=\"0\" stroke-width=\"3\" stroke-dasharray=\"5,5\"></line>\n                </svg>\n                <div id=\"ptpassage_container\" class=\"ptpassage_container\">\n                    <div id=\"ptpassage_value\" class=\"ptpassage_value\"></div>\n                    <div id=\"ptpassage_legend\" class=\"ptpassage_legend\"></div>\n                </div>\n            ";
                        this.visual_top.innerHTML = infos_container_html;
                        this.engine = new DomManipulation(this.visual_top);
                        // this.value_text_libelle = document.getElementById("current_value_libelle").appendChild(document.createTextNode(""));
                        // this.value_text = document.getElementById("current_value").appendChild(document.createTextNode(""));
                        // this.percent_text = document.getElementById("percent_value").appendChild(document.createTextNode(""));
                        // this.reste_text = document.getElementById("reste_value").appendChild(document.createTextNode(""));
                        // this.reste_libelle = document.getElementById("reste_legend").appendChild(document.createTextNode(""));
                        // this.right_container = document.getElementById("right_container");
                        /* this.bottom_container = document.getElementById("container_bottom");
                        this.ptpassage_container = document.getElementById("ptpassage_container");
                        this.ptpassage_text = document.getElementById("ptpassage_value").appendChild(document.createTextNode(""));
                        this.ptpassage_libelle = document.getElementById("ptpassage_legend").appendChild(document.createTextNode("")); */
                        // this.back_rectangle = document.getElementById("back_rectangle");
                        // this.svg = d3.select(document.getElementById("svg"));
                        // this.gcontainer = this.svg.append('g').classed('percenter', true);
                        // this.back_rectangle = this.gcontainer
                        //     .append('g')
                        //     .selectAll('rect')
                        //     .data([this.visual_top.offsetWidth])
                        //     .enter()
                        //     .append("rect");
                        /*     this.front_rectangle = this.gcontainer
                                .append('g')
                                .selectAll('rect')
                                .data([0])
                                .enter()
                                .append("rect"); */
                        // this.objectif_rectangle = this.gcontainer
                        //     .append('g')
                        //     .selectAll('line')
                        //     .data([0])
                        //     .enter()
                        //     .append("line")
                        //     .attr('y1', 0)
                        //     .style("stroke-width", "1")
                        //     .attr("width", 3)
                        //     .classed("none", true);
                        // this.objectif_triangle = this.gcontainer
                        //     .append('g')
                        //     .append('path')
                        //     .attr("d", d3.symbol().type(d3.symbolTriangle).size(100))
                        //     .attr("transform", function (d) { return "translate(" + 10 + "," + 10 + ")"; })
                        //     .classed("none", true);
                        // this.objectif_text = this.gcontainer
                        //     .append('g')
                        //     .selectAll('text')
                        //     .data([''])
                        //     .enter()
                        //     .append('text');
                        // this.zero_text = this.gcontainer
                        //     .append('g')
                        //     .append('text')
                        //     .text("0")
                        //     .attr('text-anchor', 'right')
                        //     .classed("none", true);
                        // this.ptpassage_rectangle = this.gcontainer
                        //     .append('g')
                        //     .selectAll('line')
                        //     .data([0])
                        //     .enter()
                        //     .append("line")
                        //     .attr('y1', 0)
                        //     .style("stroke-width", "3")
                        //     .style("stroke-dasharray", "5,5")
                        //     .classed("none", true);
                    }
                    Visual.prototype.update = function (options) {
                        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        this.visual_top.setAttribute("style", "height:" + options.viewport.height + "px;margin: 0 " + this.settings.dataDisplay.horizontal_margin + "px");
                        var gwidth = this.visual_top.clientWidth;
                        var svg_bottom_height = 36;
                        var _settings = this.settings;
                        var value = Visual.getvalue(options.dataViews[0].categorical, "measure");
                        var objectif_value = Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
                        var pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
                        var todo_measure = +Visual.getvalue(options.dataViews[0].categorical, "todo_measure");
                        var prct_measure = Visual.getvalue(options.dataViews[0].categorical, "prct_measure");
                        var front_total_width = gwidth - gwidth * 10 / 100;
                        var value_position = 0;
                        var objectif_position = 0;
                        if (objectif_value < value) {
                            value_position = front_total_width;
                            objectif_position = objectif_value / value * front_total_width;
                        }
                        else {
                            value_position = value / objectif_value * front_total_width;
                            objectif_position = front_total_width;
                        }
                        var ptpassage_position = pt_passage_value / objectif_value * objectif_position;
                        var vm = [{
                                id: "current_value_libelle",
                                visible: !!this.settings.dataDisplay.realisation_text,
                                value: this.settings.dataDisplay.realisation_text
                            },
                            {
                                id: "current_value",
                                visible: !!value,
                                value: function () {
                                    if (value) {
                                        return (+value).toLocaleString();
                                    }
                                },
                            },
                            {
                                id: "percent_value",
                                visible: !!prct_measure,
                                value: function () {
                                    if (prct_measure) {
                                        return ((+prct_measure).toFixed(0)).toLocaleString() + "%";
                                    }
                                },
                            },
                            {
                                id: "reste_legend",
                                visible: !!this.settings.dataDisplay.resteafaire_text && !!todo_measure,
                                value: this.settings.dataDisplay.resteafaire_text
                            },
                            {
                                id: "reste_value",
                                visible: !!todo_measure,
                                value: function () {
                                    if (todo_measure) {
                                        return (+todo_measure).toLocaleString();
                                    }
                                },
                            },
                            {
                                id: "svg",
                                attr: {
                                    width: gwidth,
                                    height: this.settings.dataDisplay.bar_height + svg_bottom_height
                                }
                            },
                            {
                                id: "back_rectangle",
                                attr: {
                                    width: gwidth,
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
                                visible: objectif_position > 15,
                                attr: {
                                    y: this.settings.dataDisplay.bar_height + 16
                                }
                            },
                            {
                                id: "objectif_rectangle",
                                visible: !!objectif_value,
                                attr: {
                                    x1: objectif_position,
                                    x2: objectif_position,
                                    y2: this.settings.dataDisplay.bar_height,
                                    stroke: this.settings.dataDisplay.objectif_color
                                }
                            },
                            {
                                id: "objectif_triangle",
                                visible: !!objectif_value,
                                attr: {
                                    transform: function () {
                                        return "translate(" + objectif_position + "," + (_settings.dataDisplay.bar_height + 2) + ")";
                                    },
                                    fill: this.settings.dataDisplay.objectif_color
                                }
                            },
                            {
                                id: "objectif_text",
                                visible: !!objectif_value,
                                value: function () {
                                    if (objectif_value) {
                                        return _settings.dataDisplay.objectif_text + " " + objectif_value.toLocaleString();
                                    }
                                },
                                attr: {
                                    "text-anchor": objectif_position < 100 ? "right" : "middle",
                                    fill: this.settings.dataDisplay.objectif_color,
                                    x: objectif_position,
                                    y: this.settings.dataDisplay.bar_height + svg_bottom_height - 4
                                }
                            },
                            {
                                id: "ptpassage_rectangle",
                                visible: this.settings.dataOption.ptPassage && pt_passage_value,
                                attr: {
                                    y2: this.settings.dataDisplay.bar_height + svg_bottom_height,
                                    x1: ptpassage_position,
                                    x2: ptpassage_position,
                                    stroke: this.settings.dataDisplay.ptpassage_color
                                }
                            },
                            {
                                id: "ptpassage_value",
                                visible: this.settings.dataOption.ptPassage && pt_passage_value,
                                value: function () {
                                    if (pt_passage_value) {
                                        return pt_passage_value.toLocaleString();
                                    }
                                }
                            },
                            {
                                id: "ptpassage_legend",
                                visible: this.settings.dataOption.ptPassage && pt_passage_value,
                                value: this.settings.dataDisplay.ptpassage_text
                            },
                            {
                                id: "ptpassage_container",
                                style: {
                                    color: this.settings.dataDisplay.ptpassage_color,
                                    "margin-left": function () {
                                        var ptpassage_container_position = ptpassage_position - 150 / 2;
                                        ptpassage_container_position = ptpassage_container_position < 0 ? 0 : ptpassage_container_position;
                                        ptpassage_container_position = ptpassage_container_position > gwidth - 150 / 2 ? gwidth - 150 : ptpassage_container_position;
                                        return ptpassage_container_position + "px";
                                    }
                                }
                            }
                        ];
                        this.engine.update(vm);
                        // const getvalue = (item, name) => {
                        //     return item[name] && typeof (item[name]) === "function" ? item[name]() : item[name];
                        // }
                        // vm.forEach(item => {
                        //     const el = <HTMLElement>this.data[item.id];
                        //     let visible = false;
                        //     if (item["visible"] !== undefined) {
                        //         el.style.visibility = getvalue(item, "visible") ? "visible" : "collapse";
                        //         visible = true;
                        //     } else {
                        //         visible = true;
                        //     }
                        //     if (visible) {
                        //         if (item["value"] !== undefined) {
                        //             const value = getvalue(item, "value");
                        //             el.innerHTML = value ? String(value) : "";
                        //         }
                        //         if (item["attr"] !== undefined) {
                        //             for (var attr_name in item["attr"]) {
                        //                 const v = getvalue(item["attr"], attr_name);
                        //                 if (getvalue(item["attr"], attr_name)) {
                        //                     el.setAttribute(attr_name, v);
                        //                 } else {
                        //                     el.removeAttribute(attr_name);
                        //                 }
                        //             }
                        //         }
                        //         if (item["style"] !== undefined) {
                        //             for (var style_name in item["style"]) {
                        //                 const v = getvalue(item["style"], style_name);
                        //                 el.style[style_name] = v ? v : "";
                        //             }
                        //         }
                        //     }
                        // });
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