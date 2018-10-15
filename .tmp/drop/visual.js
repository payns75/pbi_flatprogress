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

// https://d3js.org/d3-dispatch/ Version 1.0.3. Copyright 2017 Mike Bostock.
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.d3=n.d3||{})}(this,function(n){"use strict";function e(){for(var n,e=0,r=arguments.length,o={};e<r;++e){if(!(n=arguments[e]+"")||n in o)throw new Error("illegal type: "+n);o[n]=[]}return new t(o)}function t(n){this._=n}function r(n,e){return n.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");if(r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),n&&!e.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:t}})}function o(n,e){for(var t,r=0,o=n.length;r<o;++r)if((t=n[r]).name===e)return t.value}function i(n,e,t){for(var r=0,o=n.length;r<o;++r)if(n[r].name===e){n[r]=f,n=n.slice(0,r).concat(n.slice(r+1));break}return null!=t&&n.push({name:e,value:t}),n}var f={value:function(){}};t.prototype=e.prototype={constructor:t,on:function(n,e){var t,f=this._,l=r(n+"",f),u=-1,a=l.length;{if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++u<a;)if(t=(n=l[u]).type)f[t]=i(f[t],n.name,e);else if(null==e)for(t in f)f[t]=i(f[t],n.name,null);return this}for(;++u<a;)if((t=(n=l[u]).type)&&(t=o(f[t],n.name)))return t}},copy:function(){var n={},e=this._;for(var r in e)n[r]=e[r].slice();return new t(n)},call:function(n,e){if((t=arguments.length-2)>0)for(var t,r,o=new Array(t),i=0;i<t;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(n))throw new Error("unknown type: "+n);for(r=this._[n],i=0,t=r.length;i<t;++i)r[i].value.apply(e,o)},apply:function(n,e,t){if(!this._.hasOwnProperty(n))throw new Error("unknown type: "+n);for(var r=this._[n],o=0,i=r.length;o<i;++o)r[o].value.apply(e,t)}},n.dispatch=e,Object.defineProperty(n,"__esModule",{value:!0})});
// https://d3js.org/d3-selection/ Version 1.3.0. Copyright 2018 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.d3=t.d3||{})}(this,function(t){"use strict";function n(t){var n=t+="",e=n.indexOf(":");return e>=0&&"xmlns"!==(n=t.slice(0,e))&&(t=t.slice(e+1)),H.hasOwnProperty(n)?{space:H[n],local:t}:t}function e(t){var e=n(t);return(e.local?function(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}:function(t){return function(){var n=this.ownerDocument,e=this.namespaceURI;return e===z&&n.documentElement.namespaceURI===z?n.createElement(t):n.createElementNS(e,t)}})(e)}function r(){}function i(t){return null==t?r:function(){return this.querySelector(t)}}function o(){return[]}function u(t){return null==t?o:function(){return this.querySelectorAll(t)}}function c(t){return new Array(t.length)}function s(t,n){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=n}function a(t,n,e,r,i,o){for(var u,c=0,a=n.length,l=o.length;c<l;++c)(u=n[c])?(u.__data__=o[c],r[c]=u):e[c]=new s(t,o[c]);for(;c<a;++c)(u=n[c])&&(i[c]=u)}function l(t,n,e,r,i,o,u){var c,a,l,f={},h=n.length,p=o.length,_=new Array(h);for(c=0;c<h;++c)(a=n[c])&&(_[c]=l=X+u.call(a,a.__data__,c,n),l in f?i[c]=a:f[l]=a);for(c=0;c<p;++c)(a=f[l=X+u.call(t,o[c],c,o)])?(r[c]=a,a.__data__=o[c],f[l]=null):e[c]=new s(t,o[c]);for(c=0;c<h;++c)(a=n[c])&&f[_[c]]===a&&(i[c]=a)}function f(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}function h(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function p(t,n){return t.style.getPropertyValue(n)||h(t).getComputedStyle(t,null).getPropertyValue(n)}function _(t){return t.trim().split(/^|\s+/)}function d(t){return t.classList||new v(t)}function v(t){this._node=t,this._names=_(t.getAttribute("class")||"")}function m(t,n){for(var e=d(t),r=-1,i=n.length;++r<i;)e.add(n[r])}function y(t,n){for(var e=d(t),r=-1,i=n.length;++r<i;)e.remove(n[r])}function g(){this.textContent=""}function w(){this.innerHTML=""}function A(){this.nextSibling&&this.parentNode.appendChild(this)}function x(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function S(){return null}function b(){var t=this.parentNode;t&&t.removeChild(this)}function E(){return this.parentNode.insertBefore(this.cloneNode(!1),this.nextSibling)}function N(){return this.parentNode.insertBefore(this.cloneNode(!0),this.nextSibling)}function C(t,n,e){return t=P(t,n,e),function(n){var e=n.relatedTarget;e&&(e===this||8&e.compareDocumentPosition(this))||t.call(this,n)}}function P(n,e,r){return function(i){var o=t.event;t.event=i;try{n.call(this,this.__data__,e,r)}finally{t.event=o}}}function M(t){return function(){var n=this.__on;if(n){for(var e,r=0,i=-1,o=n.length;r<o;++r)e=n[r],t.type&&e.type!==t.type||e.name!==t.name?n[++i]=e:this.removeEventListener(e.type,e.listener,e.capture);++i?n.length=i:delete this.__on}}}function L(t,n,e){var r=Y.hasOwnProperty(t.type)?C:P;return function(i,o,u){var c,s=this.__on,a=r(n,o,u);if(s)for(var l=0,f=s.length;l<f;++l)if((c=s[l]).type===t.type&&c.name===t.name)return this.removeEventListener(c.type,c.listener,c.capture),this.addEventListener(c.type,c.listener=a,c.capture=e),void(c.value=n);this.addEventListener(t.type,a,e),c={type:t.type,name:t.name,value:n,listener:a,capture:e},s?s.push(c):this.__on=[c]}}function T(t,n,e){var r=h(t),i=r.CustomEvent;"function"==typeof i?i=new i(n,e):(i=r.document.createEvent("Event"),e?(i.initEvent(n,e.bubbles,e.cancelable),i.detail=e.detail):i.initEvent(n,!1,!1)),t.dispatchEvent(i)}function B(t,n){this._groups=t,this._parents=n}function q(){return new B([[document.documentElement]],$)}function O(t){return"string"==typeof t?new B([[document.querySelector(t)]],[document.documentElement]):new B([[t]],$)}function D(){return new V}function V(){this._="@"+(++F).toString(36)}function R(){for(var n,e=t.event;n=e.sourceEvent;)e=n;return e}function j(t,n){var e=t.ownerSVGElement||t;if(e.createSVGPoint){var r=e.createSVGPoint();return r.x=n.clientX,r.y=n.clientY,r=r.matrixTransform(t.getScreenCTM().inverse()),[r.x,r.y]}var i=t.getBoundingClientRect();return[n.clientX-i.left-t.clientLeft,n.clientY-i.top-t.clientTop]}var z="http://www.w3.org/1999/xhtml",H={svg:"http://www.w3.org/2000/svg",xhtml:z,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},I=function(t){return function(){return this.matches(t)}};if("undefined"!=typeof document){var U=document.documentElement;if(!U.matches){var k=U.webkitMatchesSelector||U.msMatchesSelector||U.mozMatchesSelector||U.oMatchesSelector;I=function(t){return function(){return k.call(this,t)}}}}var G=I;s.prototype={constructor:s,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,n){return this._parent.insertBefore(t,n)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};var X="$";v.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var n=this._names.indexOf(t);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var Y={};if(t.event=null,"undefined"!=typeof document){"onmouseenter"in document.documentElement||(Y={mouseenter:"mouseover",mouseleave:"mouseout"})}var $=[null];B.prototype=q.prototype={constructor:B,select:function(t){"function"!=typeof t&&(t=i(t));for(var n=this._groups,e=n.length,r=new Array(e),o=0;o<e;++o)for(var u,c,s=n[o],a=s.length,l=r[o]=new Array(a),f=0;f<a;++f)(u=s[f])&&(c=t.call(u,u.__data__,f,s))&&("__data__"in u&&(c.__data__=u.__data__),l[f]=c);return new B(r,this._parents)},selectAll:function(t){"function"!=typeof t&&(t=u(t));for(var n=this._groups,e=n.length,r=[],i=[],o=0;o<e;++o)for(var c,s=n[o],a=s.length,l=0;l<a;++l)(c=s[l])&&(r.push(t.call(c,c.__data__,l,s)),i.push(c));return new B(r,i)},filter:function(t){"function"!=typeof t&&(t=G(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u=n[i],c=u.length,s=r[i]=[],a=0;a<c;++a)(o=u[a])&&t.call(o,o.__data__,a,u)&&s.push(o);return new B(r,this._parents)},data:function(t,n){if(!t)return d=new Array(this.size()),f=-1,this.each(function(t){d[++f]=t}),d;var e=n?l:a,r=this._parents,i=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var o=i.length,u=new Array(o),c=new Array(o),s=new Array(o),f=0;f<o;++f){var h=r[f],p=i[f],_=p.length,d=t.call(h,h&&h.__data__,f,r),v=d.length,m=c[f]=new Array(v),y=u[f]=new Array(v);e(h,p,m,y,s[f]=new Array(_),d,n);for(var g,w,A=0,x=0;A<v;++A)if(g=m[A]){for(A>=x&&(x=A+1);!(w=y[x])&&++x<v;);g._next=w||null}}return u=new B(u,r),u._enter=c,u._exit=s,u},enter:function(){return new B(this._enter||this._groups.map(c),this._parents)},exit:function(){return new B(this._exit||this._groups.map(c),this._parents)},merge:function(t){for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),u=new Array(r),c=0;c<o;++c)for(var s,a=n[c],l=e[c],f=a.length,h=u[c]=new Array(f),p=0;p<f;++p)(s=a[p]||l[p])&&(h[p]=s);for(;c<r;++c)u[c]=n[c];return new B(u,this._parents)},order:function(){for(var t=this._groups,n=-1,e=t.length;++n<e;)for(var r,i=t[n],o=i.length-1,u=i[o];--o>=0;)(r=i[o])&&(u&&u!==r.nextSibling&&u.parentNode.insertBefore(r,u),u=r);return this},sort:function(t){function n(n,e){return n&&e?t(n.__data__,e.__data__):!n-!e}t||(t=f);for(var e=this._groups,r=e.length,i=new Array(r),o=0;o<r;++o){for(var u,c=e[o],s=c.length,a=i[o]=new Array(s),l=0;l<s;++l)(u=c[l])&&(a[l]=u);a.sort(n)}return new B(i,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){var t=new Array(this.size()),n=-1;return this.each(function(){t[++n]=this}),t},node:function(){for(var t=this._groups,n=0,e=t.length;n<e;++n)for(var r=t[n],i=0,o=r.length;i<o;++i){var u=r[i];if(u)return u}return null},size:function(){var t=0;return this.each(function(){++t}),t},empty:function(){return!this.node()},each:function(t){for(var n=this._groups,e=0,r=n.length;e<r;++e)for(var i,o=n[e],u=0,c=o.length;u<c;++u)(i=o[u])&&t.call(i,i.__data__,u,o);return this},attr:function(t,e){var r=n(t);if(arguments.length<2){var i=this.node();return r.local?i.getAttributeNS(r.space,r.local):i.getAttribute(r)}return this.each((null==e?r.local?function(t){return function(){this.removeAttributeNS(t.space,t.local)}}:function(t){return function(){this.removeAttribute(t)}}:"function"==typeof e?r.local?function(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,e)}}:function(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttribute(t):this.setAttribute(t,e)}}:r.local?function(t,n){return function(){this.setAttributeNS(t.space,t.local,n)}}:function(t,n){return function(){this.setAttribute(t,n)}})(r,e))},style:function(t,n,e){return arguments.length>1?this.each((null==n?function(t){return function(){this.style.removeProperty(t)}}:"function"==typeof n?function(t,n,e){return function(){var r=n.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,e)}}:function(t,n,e){return function(){this.style.setProperty(t,n,e)}})(t,n,null==e?"":e)):p(this.node(),t)},property:function(t,n){return arguments.length>1?this.each((null==n?function(t){return function(){delete this[t]}}:"function"==typeof n?function(t,n){return function(){var e=n.apply(this,arguments);null==e?delete this[t]:this[t]=e}}:function(t,n){return function(){this[t]=n}})(t,n)):this.node()[t]},classed:function(t,n){var e=_(t+"");if(arguments.length<2){for(var r=d(this.node()),i=-1,o=e.length;++i<o;)if(!r.contains(e[i]))return!1;return!0}return this.each(("function"==typeof n?function(t,n){return function(){(n.apply(this,arguments)?m:y)(this,t)}}:n?function(t){return function(){m(this,t)}}:function(t){return function(){y(this,t)}})(e,n))},text:function(t){return arguments.length?this.each(null==t?g:("function"==typeof t?function(t){return function(){var n=t.apply(this,arguments);this.textContent=null==n?"":n}}:function(t){return function(){this.textContent=t}})(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?w:("function"==typeof t?function(t){return function(){var n=t.apply(this,arguments);this.innerHTML=null==n?"":n}}:function(t){return function(){this.innerHTML=t}})(t)):this.node().innerHTML},raise:function(){return this.each(A)},lower:function(){return this.each(x)},append:function(t){var n="function"==typeof t?t:e(t);return this.select(function(){return this.appendChild(n.apply(this,arguments))})},insert:function(t,n){var r="function"==typeof t?t:e(t),o=null==n?S:"function"==typeof n?n:i(n);return this.select(function(){return this.insertBefore(r.apply(this,arguments),o.apply(this,arguments)||null)})},remove:function(){return this.each(b)},clone:function(t){return this.select(t?N:E)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,n,e){var r,i,o=function(t){return t.trim().split(/^|\s+/).map(function(t){var n="",e=t.indexOf(".");return e>=0&&(n=t.slice(e+1),t=t.slice(0,e)),{type:t,name:n}})}(t+""),u=o.length;if(!(arguments.length<2)){for(c=n?L:M,null==e&&(e=!1),r=0;r<u;++r)this.each(c(o[r],n,e));return this}var c=this.node().__on;if(c)for(var s,a=0,l=c.length;a<l;++a)for(r=0,s=c[a];r<u;++r)if((i=o[r]).type===s.type&&i.name===s.name)return s.value},dispatch:function(t,n){return this.each(("function"==typeof n?function(t,n){return function(){return T(this,t,n.apply(this,arguments))}}:function(t,n){return function(){return T(this,t,n)}})(t,n))}};var F=0;V.prototype=D.prototype={constructor:V,get:function(t){for(var n=this._;!(n in t);)if(!(t=t.parentNode))return;return t[n]},set:function(t,n){return t[this._]=n},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}},t.create=function(t){return O(e(t).call(document.documentElement))},t.creator=e,t.local=D,t.matcher=G,t.mouse=function(t){var n=R();return n.changedTouches&&(n=n.changedTouches[0]),j(t,n)},t.namespace=n,t.namespaces=H,t.clientPoint=j,t.select=O,t.selectAll=function(t){return"string"==typeof t?new B([document.querySelectorAll(t)],[document.documentElement]):new B([null==t?[]:t],$)},t.selection=q,t.selector=i,t.selectorAll=u,t.style=p,t.touch=function(t,n,e){arguments.length<3&&(e=n,n=R().changedTouches);for(var r,i=0,o=n?n.length:0;i<o;++i)if((r=n[i]).identifier===e)return j(t,r);return null},t.touches=function(t,n){null==n&&(n=R().touches);for(var e=0,r=n?n.length:0,i=new Array(r);e<r;++e)i[e]=j(t,n[e]);return i},t.window=h,t.customEvent=function(n,e,r,i){var o=t.event;n.sourceEvent=t.event,t.event=n;try{return e.apply(r,i)}finally{t.event=o}},Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-color/ Version 1.0.3. Copyright 2017 Mike Bostock.
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.d3=t.d3||{})}(this,function(t){"use strict";function e(t,e){var n=Object.create(t.prototype);for(var i in e)n[i]=e[i];return n}function n(){}function i(t){var e;return t=(t+"").trim().toLowerCase(),(e=P.exec(t))?(e=parseInt(e[1],16),new h(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1)):(e=O.exec(t))?r(parseInt(e[1],16)):(e=S.exec(t))?new h(e[1],e[2],e[3],1):(e=_.exec(t))?new h(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=z.exec(t))?a(e[1],e[2],e[3],e[4]):(e=C.exec(t))?a(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=L.exec(t))?l(e[1],e[2]/100,e[3]/100,1):(e=A.exec(t))?l(e[1],e[2]/100,e[3]/100,e[4]):B.hasOwnProperty(t)?r(B[t]):"transparent"===t?new h(NaN,NaN,NaN,0):null}function r(t){return new h(t>>16&255,t>>8&255,255&t,1)}function a(t,e,n,i){return i<=0&&(t=e=n=NaN),new h(t,e,n,i)}function s(t){return t instanceof n||(t=i(t)),t?(t=t.rgb(),new h(t.r,t.g,t.b,t.opacity)):new h}function o(t,e,n,i){return 1===arguments.length?s(t):new h(t,e,n,null==i?1:i)}function h(t,e,n,i){this.r=+t,this.g=+e,this.b=+n,this.opacity=+i}function l(t,e,n,i){return i<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new g(t,e,n,i)}function u(t){if(t instanceof g)return new g(t.h,t.s,t.l,t.opacity);if(t instanceof n||(t=i(t)),!t)return new g;if(t instanceof g)return t;t=t.rgb();var e=t.r/255,r=t.g/255,a=t.b/255,s=Math.min(e,r,a),o=Math.max(e,r,a),h=NaN,l=o-s,u=(o+s)/2;return l?(h=e===o?(r-a)/l+6*(r<a):r===o?(a-e)/l+2:(e-r)/l+4,l/=u<.5?o+s:2-o-s,h*=60):l=u>0&&u<1?0:h,new g(h,l,u,t.opacity)}function c(t,e,n,i){return 1===arguments.length?u(t):new g(t,e,n,null==i?1:i)}function g(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}function d(t,e,n){return 255*(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)}function p(t){if(t instanceof b)return new b(t.l,t.a,t.b,t.opacity);if(t instanceof v){var e=t.h*D;return new b(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}t instanceof h||(t=s(t));var n=k(t.r),i=k(t.g),r=k(t.b),a=y((.4124564*n+.3575761*i+.1804375*r)/G),o=y((.2126729*n+.7151522*i+.072175*r)/H);return new b(116*o-16,500*(a-o),200*(o-y((.0193339*n+.119192*i+.9503041*r)/J)),t.opacity)}function f(t,e,n,i){return 1===arguments.length?p(t):new b(t,e,n,null==i?1:i)}function b(t,e,n,i){this.l=+t,this.a=+e,this.b=+n,this.opacity=+i}function y(t){return t>U?Math.pow(t,1/3):t/T+K}function w(t){return t>Q?t*t*t:T*(t-K)}function m(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function k(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function N(t){if(t instanceof v)return new v(t.h,t.c,t.l,t.opacity);t instanceof b||(t=p(t));var e=Math.atan2(t.b,t.a)*F;return new v(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function M(t,e,n,i){return 1===arguments.length?N(t):new v(t,e,n,null==i?1:i)}function v(t,e,n,i){this.h=+t,this.c=+e,this.l=+n,this.opacity=+i}function x(t){if(t instanceof E)return new E(t.h,t.s,t.l,t.opacity);t instanceof h||(t=s(t));var e=t.r/255,n=t.g/255,i=t.b/255,r=(nt*i+tt*e-et*n)/(nt+tt-et),a=i-r,o=(Z*(n-r)-X*a)/Y,l=Math.sqrt(o*o+a*a)/(Z*r*(1-r)),u=l?Math.atan2(o,a)*F-120:NaN;return new E(u<0?u+360:u,l,r,t.opacity)}function q(t,e,n,i){return 1===arguments.length?x(t):new E(t,e,n,null==i?1:i)}function E(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}var $=function(t,e,n){t.prototype=e.prototype=n,n.constructor=t},R="\\s*([+-]?\\d+)\\s*",j="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",I="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",P=/^#([0-9a-f]{3})$/,O=/^#([0-9a-f]{6})$/,S=new RegExp("^rgb\\("+[R,R,R]+"\\)$"),_=new RegExp("^rgb\\("+[I,I,I]+"\\)$"),z=new RegExp("^rgba\\("+[R,R,R,j]+"\\)$"),C=new RegExp("^rgba\\("+[I,I,I,j]+"\\)$"),L=new RegExp("^hsl\\("+[j,I,I]+"\\)$"),A=new RegExp("^hsla\\("+[j,I,I,j]+"\\)$"),B={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};$(n,i,{displayable:function(){return this.rgb().displayable()},toString:function(){return this.rgb()+""}}),$(h,o,e(n,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new h(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new h(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&this.r<=255&&0<=this.g&&this.g<=255&&0<=this.b&&this.b<=255&&0<=this.opacity&&this.opacity<=1},toString:function(){var t=this.opacity;return t=isNaN(t)?1:Math.max(0,Math.min(1,t)),(1===t?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}})),$(g,c,e(n,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new g(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new g(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*e,r=2*n-i;return new h(d(t>=240?t-240:t+120,r,i),d(t,r,i),d(t<120?t+240:t-120,r,i),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1}}));var D=Math.PI/180,F=180/Math.PI,G=.95047,H=1,J=1.08883,K=4/29,Q=6/29,T=3*Q*Q,U=Q*Q*Q;$(b,f,e(n,{brighter:function(t){return new b(this.l+18*(null==t?1:t),this.a,this.b,this.opacity)},darker:function(t){return new b(this.l-18*(null==t?1:t),this.a,this.b,this.opacity)},rgb:function(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,n=isNaN(this.b)?t:t-this.b/200;return t=H*w(t),e=G*w(e),n=J*w(n),new h(m(3.2404542*e-1.5371385*t-.4985314*n),m(-.969266*e+1.8760108*t+.041556*n),m(.0556434*e-.2040259*t+1.0572252*n),this.opacity)}})),$(v,M,e(n,{brighter:function(t){return new v(this.h,this.c,this.l+18*(null==t?1:t),this.opacity)},darker:function(t){return new v(this.h,this.c,this.l-18*(null==t?1:t),this.opacity)},rgb:function(){return p(this).rgb()}}));var V=-.14861,W=1.78277,X=-.29227,Y=-.90649,Z=1.97294,tt=Z*Y,et=Z*W,nt=W*X-Y*V;$(E,q,e(n,{brighter:function(t){return t=null==t?1/.7:Math.pow(1/.7,t),new E(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?.7:Math.pow(.7,t),new E(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=isNaN(this.h)?0:(this.h+120)*D,e=+this.l,n=isNaN(this.s)?0:this.s*e*(1-e),i=Math.cos(t),r=Math.sin(t);return new h(255*(e+n*(V*i+W*r)),255*(e+n*(X*i+Y*r)),255*(e+n*(Z*i)),this.opacity)}})),t.color=i,t.rgb=o,t.hsl=c,t.lab=f,t.hcl=M,t.cubehelix=q,Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-ease/ Version 1.0.3. Copyright 2017 Mike Bostock.
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.d3=n.d3||{})}(this,function(n){"use strict";function t(n){return+n}function e(n){return n*n}function u(n){return n*(2-n)}function r(n){return((n*=2)<=1?n*n:--n*(2-n)+1)/2}function a(n){return n*n*n}function o(n){return--n*n*n+1}function i(n){return((n*=2)<=1?n*n*n:(n-=2)*n*n+2)/2}function c(n){return 1-Math.cos(n*C)}function s(n){return Math.sin(n*C)}function f(n){return(1-Math.cos(B*n))/2}function h(n){return Math.pow(2,10*n-10)}function p(n){return 1-Math.pow(2,-10*n)}function M(n){return((n*=2)<=1?Math.pow(2,10*n-10):2-Math.pow(2,10-10*n))/2}function d(n){return 1-Math.sqrt(1-n*n)}function I(n){return Math.sqrt(1- --n*n)}function O(n){return((n*=2)<=1?1-Math.sqrt(1-n*n):Math.sqrt(1-(n-=2)*n)+1)/2}function l(n){return 1-x(1-n)}function x(n){return(n=+n)<E?L*n*n:n<b?L*(n-=P)*n+k:n<Q?L*(n-=q)*n+S:L*(n-=j)*n+_}function w(n){return((n*=2)<=1?1-x(1-n):x(n-1)+1)/2}var m=function n(t){function e(n){return Math.pow(n,t)}return t=+t,e.exponent=n,e}(3),v=function n(t){function e(n){return 1-Math.pow(1-n,t)}return t=+t,e.exponent=n,e}(3),y=function n(t){function e(n){return((n*=2)<=1?Math.pow(n,t):2-Math.pow(2-n,t))/2}return t=+t,e.exponent=n,e}(3),B=Math.PI,C=B/2,E=4/11,P=6/11,b=8/11,k=.75,q=9/11,Q=10/11,S=.9375,j=21/22,_=63/64,L=1/E/E,g=function n(t){function e(n){return n*n*((t+1)*n-t)}return t=+t,e.overshoot=n,e}(1.70158),z=function n(t){function e(n){return--n*n*((t+1)*n+t)+1}return t=+t,e.overshoot=n,e}(1.70158),A=function n(t){function e(n){return((n*=2)<1?n*n*((t+1)*n-t):(n-=2)*n*((t+1)*n+t)+2)/2}return t=+t,e.overshoot=n,e}(1.70158),D=2*Math.PI,F=function n(t,e){function u(n){return t*Math.pow(2,10*--n)*Math.sin((r-n)/e)}var r=Math.asin(1/(t=Math.max(1,t)))*(e/=D);return u.amplitude=function(t){return n(t,e*D)},u.period=function(e){return n(t,e)},u}(1,.3),G=function n(t,e){function u(n){return 1-t*Math.pow(2,-10*(n=+n))*Math.sin((n+r)/e)}var r=Math.asin(1/(t=Math.max(1,t)))*(e/=D);return u.amplitude=function(t){return n(t,e*D)},u.period=function(e){return n(t,e)},u}(1,.3),H=function n(t,e){function u(n){return((n=2*n-1)<0?t*Math.pow(2,10*n)*Math.sin((r-n)/e):2-t*Math.pow(2,-10*n)*Math.sin((r+n)/e))/2}var r=Math.asin(1/(t=Math.max(1,t)))*(e/=D);return u.amplitude=function(t){return n(t,e*D)},u.period=function(e){return n(t,e)},u}(1,.3);n.easeLinear=t,n.easeQuad=r,n.easeQuadIn=e,n.easeQuadOut=u,n.easeQuadInOut=r,n.easeCubic=i,n.easeCubicIn=a,n.easeCubicOut=o,n.easeCubicInOut=i,n.easePoly=y,n.easePolyIn=m,n.easePolyOut=v,n.easePolyInOut=y,n.easeSin=f,n.easeSinIn=c,n.easeSinOut=s,n.easeSinInOut=f,n.easeExp=M,n.easeExpIn=h,n.easeExpOut=p,n.easeExpInOut=M,n.easeCircle=O,n.easeCircleIn=d,n.easeCircleOut=I,n.easeCircleInOut=O,n.easeBounce=x,n.easeBounceIn=l,n.easeBounceOut=x,n.easeBounceInOut=w,n.easeBack=A,n.easeBackIn=g,n.easeBackOut=z,n.easeBackInOut=A,n.easeElastic=G,n.easeElasticIn=F,n.easeElasticOut=G,n.easeElasticInOut=H,Object.defineProperty(n,"__esModule",{value:!0})});
// https://d3js.org/d3-interpolate/ Version 1.1.6. Copyright 2017 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-color")):"function"==typeof define&&define.amd?define(["exports","d3-color"],n):n(t.d3=t.d3||{},t.d3)}(this,function(t,n){"use strict";function r(t,n,r,e,o){var u=t*t,a=u*t;return((1-3*t+3*u-a)*n+(4-6*u+3*a)*r+(1+3*t+3*u-3*a)*e+a*o)/6}function e(t,n){return function(r){return t+r*n}}function o(t,n,r){return t=Math.pow(t,r),n=Math.pow(n,r)-t,r=1/r,function(e){return Math.pow(t+e*n,r)}}function u(t,n){var r=n-t;return r?e(t,r>180||r<-180?r-360*Math.round(r/360):r):Y(isNaN(t)?n:t)}function a(t){return 1==(t=+t)?i:function(n,r){return r-n?o(n,r,t):Y(isNaN(n)?r:n)}}function i(t,n){var r=n-t;return r?e(t,r):Y(isNaN(t)?n:t)}function l(t){return function(r){var e,o,u=r.length,a=new Array(u),i=new Array(u),l=new Array(u);for(e=0;e<u;++e)o=n.rgb(r[e]),a[e]=o.r||0,i[e]=o.g||0,l[e]=o.b||0;return a=t(a),i=t(i),l=t(l),o.opacity=1,function(t){return o.r=a(t),o.g=i(t),o.b=l(t),o+""}}}function c(t){return function(){return t}}function f(t){return function(n){return t(n)+""}}function s(t){return"none"===t?O:(M||(M=document.createElement("DIV"),w=document.documentElement,X=document.defaultView),M.style.transform=t,t=X.getComputedStyle(w.appendChild(M),null).getPropertyValue("transform"),w.removeChild(M),t=t.slice(7,-1).split(","),P(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))}function p(t){return null==t?O:(A||(A=document.createElementNS("http://www.w3.org/2000/svg","g")),A.setAttribute("transform",t),(t=A.transform.baseVal.consolidate())?(t=t.matrix,P(t.a,t.b,t.c,t.d,t.e,t.f)):O)}function h(t,n,r,e){function o(t){return t.length?t.pop()+" ":""}function u(t,e,o,u,a,i){if(t!==o||e!==u){var l=a.push("translate(",null,n,null,r);i.push({i:l-4,x:E(t,o)},{i:l-2,x:E(e,u)})}else(o||u)&&a.push("translate("+o+n+u+r)}function a(t,n,r,u){t!==n?(t-n>180?n+=360:n-t>180&&(t+=360),u.push({i:r.push(o(r)+"rotate(",null,e)-2,x:E(t,n)})):n&&r.push(o(r)+"rotate("+n+e)}function i(t,n,r,u){t!==n?u.push({i:r.push(o(r)+"skewX(",null,e)-2,x:E(t,n)}):n&&r.push(o(r)+"skewX("+n+e)}function l(t,n,r,e,u,a){if(t!==r||n!==e){var i=u.push(o(u)+"scale(",null,",",null,")");a.push({i:i-4,x:E(t,r)},{i:i-2,x:E(n,e)})}else 1===r&&1===e||u.push(o(u)+"scale("+r+","+e+")")}return function(n,r){var e=[],o=[];return n=t(n),r=t(r),u(n.translateX,n.translateY,r.translateX,r.translateY,e,o),a(n.rotate,r.rotate,e,o),i(n.skewX,r.skewX,e,o),l(n.scaleX,n.scaleY,r.scaleX,r.scaleY,e,o),n=r=null,function(t){for(var n,r=-1,u=o.length;++r<u;)e[(n=o[r]).i]=n.x(t);return e.join("")}}}function g(t){return((t=Math.exp(t))+1/t)/2}function d(t){return((t=Math.exp(t))-1/t)/2}function y(t){return((t=Math.exp(2*t))-1)/(t+1)}function v(t){return function(r,e){var o=t((r=n.hsl(r)).h,(e=n.hsl(e)).h),u=i(r.s,e.s),a=i(r.l,e.l),l=i(r.opacity,e.opacity);return function(t){return r.h=o(t),r.s=u(t),r.l=a(t),r.opacity=l(t),r+""}}}function b(t,r){var e=i((t=n.lab(t)).l,(r=n.lab(r)).l),o=i(t.a,r.a),u=i(t.b,r.b),a=i(t.opacity,r.opacity);return function(n){return t.l=e(n),t.a=o(n),t.b=u(n),t.opacity=a(n),t+""}}function x(t){return function(r,e){var o=t((r=n.hcl(r)).h,(e=n.hcl(e)).h),u=i(r.c,e.c),a=i(r.l,e.l),l=i(r.opacity,e.opacity);return function(t){return r.h=o(t),r.c=u(t),r.l=a(t),r.opacity=l(t),r+""}}}function m(t){return function r(e){function o(r,o){var u=t((r=n.cubehelix(r)).h,(o=n.cubehelix(o)).h),a=i(r.s,o.s),l=i(r.l,o.l),c=i(r.opacity,o.opacity);return function(t){return r.h=u(t),r.s=a(t),r.l=l(Math.pow(t,e)),r.opacity=c(t),r+""}}return e=+e,o.gamma=r,o}(1)}var M,w,X,A,N=function(t){var n=t.length-1;return function(e){var o=e<=0?e=0:e>=1?(e=1,n-1):Math.floor(e*n),u=t[o],a=t[o+1],i=o>0?t[o-1]:2*u-a,l=o<n-1?t[o+2]:2*a-u;return r((e-o/n)*n,i,u,a,l)}},C=function(t){var n=t.length;return function(e){var o=Math.floor(((e%=1)<0?++e:e)*n),u=t[(o+n-1)%n],a=t[o%n],i=t[(o+1)%n],l=t[(o+2)%n];return r((e-o/n)*n,u,a,i,l)}},Y=function(t){return function(){return t}},j=function t(r){function e(t,r){var e=o((t=n.rgb(t)).r,(r=n.rgb(r)).r),u=o(t.g,r.g),a=o(t.b,r.b),l=i(t.opacity,r.opacity);return function(n){return t.r=e(n),t.g=u(n),t.b=a(n),t.opacity=l(n),t+""}}var o=a(r);return e.gamma=t,e}(1),q=l(N),k=l(C),R=function(t,n){var r,e=n?n.length:0,o=t?Math.min(e,t.length):0,u=new Array(o),a=new Array(e);for(r=0;r<o;++r)u[r]=L(t[r],n[r]);for(;r<e;++r)a[r]=n[r];return function(t){for(r=0;r<o;++r)a[r]=u[r](t);return a}},S=function(t,n){var r=new Date;return t=+t,n-=t,function(e){return r.setTime(t+n*e),r}},E=function(t,n){return t=+t,n-=t,function(r){return t+n*r}},I=function(t,n){var r,e={},o={};null!==t&&"object"==typeof t||(t={}),null!==n&&"object"==typeof n||(n={});for(r in n)r in t?e[r]=L(t[r],n[r]):o[r]=n[r];return function(t){for(r in e)o[r]=e[r](t);return o}},B=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,D=new RegExp(B.source,"g"),H=function(t,n){var r,e,o,u=B.lastIndex=D.lastIndex=0,a=-1,i=[],l=[];for(t+="",n+="";(r=B.exec(t))&&(e=D.exec(n));)(o=e.index)>u&&(o=n.slice(u,o),i[a]?i[a]+=o:i[++a]=o),(r=r[0])===(e=e[0])?i[a]?i[a]+=e:i[++a]=e:(i[++a]=null,l.push({i:a,x:E(r,e)})),u=D.lastIndex;return u<n.length&&(o=n.slice(u),i[a]?i[a]+=o:i[++a]=o),i.length<2?l[0]?f(l[0].x):c(n):(n=l.length,function(t){for(var r,e=0;e<n;++e)i[(r=l[e]).i]=r.x(t);return i.join("")})},L=function(t,r){var e,o=typeof r;return null==r||"boolean"===o?Y(r):("number"===o?E:"string"===o?(e=n.color(r))?(r=e,j):H:r instanceof n.color?j:r instanceof Date?S:Array.isArray(r)?R:"function"!=typeof r.valueOf&&"function"!=typeof r.toString||isNaN(r)?I:E)(t,r)},T=function(t,n){return t=+t,n-=t,function(r){return Math.round(t+n*r)}},V=180/Math.PI,O={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1},P=function(t,n,r,e,o,u){var a,i,l;return(a=Math.sqrt(t*t+n*n))&&(t/=a,n/=a),(l=t*r+n*e)&&(r-=t*l,e-=n*l),(i=Math.sqrt(r*r+e*e))&&(r/=i,e/=i,l/=i),t*e<n*r&&(t=-t,n=-n,l=-l,a=-a),{translateX:o,translateY:u,rotate:Math.atan2(n,t)*V,skewX:Math.atan(l)*V,scaleX:a,scaleY:i}},_=h(s,"px, ","px)","deg)"),z=h(p,", ",")",")"),Q=Math.SQRT2,Z=function(t,n){var r,e,o=t[0],u=t[1],a=t[2],i=n[0],l=n[1],c=n[2],f=i-o,s=l-u,p=f*f+s*s;if(p<1e-12)e=Math.log(c/a)/Q,r=function(t){return[o+t*f,u+t*s,a*Math.exp(Q*t*e)]};else{var h=Math.sqrt(p),v=(c*c-a*a+4*p)/(2*a*2*h),b=(c*c-a*a-4*p)/(2*c*2*h),x=Math.log(Math.sqrt(v*v+1)-v),m=Math.log(Math.sqrt(b*b+1)-b);e=(m-x)/Q,r=function(t){var n=t*e,r=g(x),i=a/(2*h)*(r*y(Q*n+x)-d(x));return[o+i*f,u+i*s,a*r/g(Q*n+x)]}}return r.duration=1e3*e,r},F=v(u),G=v(i),J=x(u),K=x(i),U=m(u),W=m(i),$=function(t,n){for(var r=new Array(n),e=0;e<n;++e)r[e]=t(e/(n-1));return r};t.interpolate=L,t.interpolateArray=R,t.interpolateBasis=N,t.interpolateBasisClosed=C,t.interpolateDate=S,t.interpolateNumber=E,t.interpolateObject=I,t.interpolateRound=T,t.interpolateString=H,t.interpolateTransformCss=_,t.interpolateTransformSvg=z,t.interpolateZoom=Z,t.interpolateRgb=j,t.interpolateRgbBasis=q,t.interpolateRgbBasisClosed=k,t.interpolateHsl=F,t.interpolateHslLong=G,t.interpolateLab=b,t.interpolateHcl=J,t.interpolateHclLong=K,t.interpolateCubehelix=U,t.interpolateCubehelixLong=W,t.quantize=$,Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-timer/ Version 1.0.7. Copyright 2017 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.d3=t.d3||{})}(this,function(t){"use strict";function n(){return h||(x(e),h=v.now()+y)}function e(){h=0}function o(){this._call=this._time=this._next=null}function i(t,n,e){var i=new o;return i.restart(t,n,e),i}function r(){n(),++_;for(var t,e=f;e;)(t=h-e._time)>=0&&e._call.call(null,t),e=e._next;--_}function u(){h=(d=v.now())+y,_=m=0;try{r()}finally{_=0,c(),h=0}}function l(){var t=v.now(),n=t-d;n>w&&(y-=n,d=t)}function c(){for(var t,n,e=f,o=1/0;e;)e._call?(o>e._time&&(o=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:f=n);s=t,a(o)}function a(t){_||(m&&(m=clearTimeout(m)),t-h>24?(t<1/0&&(m=setTimeout(u,t-v.now()-y)),p&&(p=clearInterval(p))):(p||(d=v.now(),p=setInterval(l,w)),_=1,x(u)))}var f,s,_=0,m=0,p=0,w=1e3,d=0,h=0,y=0,v="object"==typeof performance&&performance.now?performance:Date,x="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};o.prototype=i.prototype={constructor:o,restart:function(t,e,o){if("function"!=typeof t)throw new TypeError("callback is not a function");o=(null==o?n():+o)+(null==e?0:+e),this._next||s===this||(s?s._next=this:f=this,s=this),this._call=t,this._time=o,a()},stop:function(){this._call&&(this._call=null,this._time=1/0,a())}};t.now=n,t.timer=i,t.timerFlush=r,t.timeout=function(t,n,e){var i=new o;return n=null==n?0:+n,i.restart(function(e){i.stop(),t(e+n)},n,e),i},t.interval=function(t,e,i){var r=new o,u=e;return null==e?(r.restart(t,e,i),r):(e=+e,i=null==i?n():+i,r.restart(function n(o){o+=u,r.restart(n,u+=e,i),t(o)},e,i),r)},Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-transition/ Version 1.1.1. Copyright 2017 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-selection"),require("d3-dispatch"),require("d3-timer"),require("d3-interpolate"),require("d3-color"),require("d3-ease")):"function"==typeof define&&define.amd?define(["exports","d3-selection","d3-dispatch","d3-timer","d3-interpolate","d3-color","d3-ease"],n):n(t.d3=t.d3||{},t.d3,t.d3,t.d3,t.d3,t.d3,t.d3)}(this,function(t,n,e,r,i,o,a){"use strict";function u(t,n){var e=l(t,n);if(e.state>J)throw new Error("too late; already scheduled");return e}function s(t,n){var e=l(t,n);if(e.state>L)throw new Error("too late; already started");return e}function l(t,n){var e=t.__transition;if(!e||!(e=e[n]))throw new Error("transition not found");return e}function f(t,n,e){function i(t){e.state=K,e.timer.restart(o,e.delay,e.time),e.delay<=t&&o(t-e.delay)}function o(i){var f,c,h,d;if(e.state!==K)return u();for(f in l)if(d=l[f],d.name===e.name){if(d.state===Q)return r.timeout(o);d.state===U?(d.state=W,d.timer.stop(),d.on.call("interrupt",t,t.__data__,d.index,d.group),delete l[f]):+f<n&&(d.state=W,d.timer.stop(),delete l[f])}if(r.timeout(function(){e.state===Q&&(e.state=U,e.timer.restart(a,e.delay,e.time),a(i))}),e.state=L,e.on.call("start",t,t.__data__,e.index,e.group),e.state===L){for(e.state=Q,s=new Array(h=e.tween.length),f=0,c=-1;f<h;++f)(d=e.tween[f].value.call(t,t.__data__,e.index,e.group))&&(s[++c]=d);s.length=c+1}}function a(n){for(var r=n<e.duration?e.ease.call(null,n/e.duration):(e.timer.restart(u),e.state=V,1),i=-1,o=s.length;++i<o;)s[i].call(null,r);e.state===V&&(e.on.call("end",t,t.__data__,e.index,e.group),u())}function u(){e.state=W,e.timer.stop(),delete l[n];for(var r in l)return;delete t.__transition}var s,l=t.__transition;l[n]=e,e.timer=r.timer(i,0,e.time)}function c(t,n){var e,r;return function(){var i=s(this,t),o=i.tween;if(o!==e){r=e=o;for(var a=0,u=r.length;a<u;++a)if(r[a].name===n){r=r.slice(),r.splice(a,1);break}}i.tween=r}}function h(t,n,e){var r,i;if("function"!=typeof e)throw new Error;return function(){var o=s(this,t),a=o.tween;if(a!==r){i=(r=a).slice();for(var u={name:n,value:e},l=0,f=i.length;l<f;++l)if(i[l].name===n){i[l]=u;break}l===f&&i.push(u)}o.tween=i}}function d(t,n,e){var r=t._id;return t.each(function(){var t=s(this,r);(t.value||(t.value={}))[n]=e.apply(this,arguments)}),function(t){return l(t,r).value[n]}}function _(t){return function(){this.removeAttribute(t)}}function p(t){return function(){this.removeAttributeNS(t.space,t.local)}}function v(t,n,e){var r,i;return function(){var o=this.getAttribute(t);return o===e?null:o===r?i:i=n(r=o,e)}}function y(t,n,e){var r,i;return function(){var o=this.getAttributeNS(t.space,t.local);return o===e?null:o===r?i:i=n(r=o,e)}}function m(t,n,e){var r,i,o;return function(){var a,u=e(this);return null==u?void this.removeAttribute(t):(a=this.getAttribute(t),a===u?null:a===r&&u===i?o:o=n(r=a,i=u))}}function w(t,n,e){var r,i,o;return function(){var a,u=e(this);return null==u?void this.removeAttributeNS(t.space,t.local):(a=this.getAttributeNS(t.space,t.local),a===u?null:a===r&&u===i?o:o=n(r=a,i=u))}}function g(t,n){function e(){var e=this,r=n.apply(e,arguments);return r&&function(n){e.setAttributeNS(t.space,t.local,r(n))}}return e._value=n,e}function b(t,n){function e(){var e=this,r=n.apply(e,arguments);return r&&function(n){e.setAttribute(t,r(n))}}return e._value=n,e}function A(t,n){return function(){u(this,t).delay=+n.apply(this,arguments)}}function x(t,n){return n=+n,function(){u(this,t).delay=n}}function E(t,n){return function(){s(this,t).duration=+n.apply(this,arguments)}}function N(t,n){return n=+n,function(){s(this,t).duration=n}}function S(t,n){if("function"!=typeof n)throw new Error;return function(){s(this,t).ease=n}}function T(t){return(t+"").trim().split(/^|\s+/).every(function(t){var n=t.indexOf(".");return n>=0&&(t=t.slice(0,n)),!t||"start"===t})}function q(t,n,e){var r,i,o=T(n)?u:s;return function(){var a=o(this,t),u=a.on;u!==r&&(i=(r=u).copy()).on(n,e),a.on=i}}function C(t){return function(){var n=this.parentNode;for(var e in this.__transition)if(+e!==t)return;n&&n.removeChild(this)}}function P(t,e){var r,i,o;return function(){var a=n.style(this,t),u=(this.style.removeProperty(t),n.style(this,t));return a===u?null:a===r&&u===i?o:o=e(r=a,i=u)}}function O(t){return function(){this.style.removeProperty(t)}}function j(t,e,r){var i,o;return function(){var a=n.style(this,t);return a===r?null:a===i?o:o=e(i=a,r)}}function k(t,e,r){var i,o,a;return function(){var u=n.style(this,t),s=r(this);return null==s&&(this.style.removeProperty(t),s=n.style(this,t)),u===s?null:u===i&&s===o?a:a=e(i=u,o=s)}}function z(t,n,e){function r(){var r=this,i=n.apply(r,arguments);return i&&function(n){r.style.setProperty(t,i(n),e)}}return r._value=n,r}function M(t){return function(){this.textContent=t}}function R(t){return function(){var n=t(this);this.textContent=null==n?"":n}}function I(t,n,e,r){this._groups=t,this._parents=n,this._name=e,this._id=r}function B(t){return n.selection().transition(t)}function D(){return++mt}function F(t,n){for(var e;!(e=t.__transition)||!(e=e[n]);)if(!(t=t.parentNode))return gt.time=r.now(),gt;return e}var G=e.dispatch("start","end","interrupt"),H=[],J=0,K=1,L=2,Q=3,U=4,V=5,W=6,X=function(t,n,e,r,i,o){var a=t.__transition;if(a){if(e in a)return}else t.__transition={};f(t,e,{name:n,index:r,group:i,on:G,tween:H,time:o.time,delay:o.delay,duration:o.duration,ease:o.ease,timer:null,state:J})},Y=function(t,n){var e,r,i,o=t.__transition,a=!0;if(o){n=null==n?null:n+"";for(i in o)(e=o[i]).name===n?(r=e.state>L&&e.state<V,e.state=W,e.timer.stop(),r&&e.on.call("interrupt",t,t.__data__,e.index,e.group),delete o[i]):a=!1;a&&delete t.__transition}},Z=function(t){return this.each(function(){Y(this,t)})},$=function(t,n){var e=this._id;if(t+="",arguments.length<2){for(var r,i=l(this.node(),e).tween,o=0,a=i.length;o<a;++o)if((r=i[o]).name===t)return r.value;return null}return this.each((null==n?c:h)(e,t,n))},tt=function(t,n){var e;return("number"==typeof n?i.interpolateNumber:n instanceof o.color?i.interpolateRgb:(e=o.color(n))?(n=e,i.interpolateRgb):i.interpolateString)(t,n)},nt=function(t,e){var r=n.namespace(t),o="transform"===r?i.interpolateTransformSvg:tt;return this.attrTween(t,"function"==typeof e?(r.local?w:m)(r,o,d(this,"attr."+t,e)):null==e?(r.local?p:_)(r):(r.local?y:v)(r,o,e+""))},et=function(t,e){var r="attr."+t;if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==e)return this.tween(r,null);if("function"!=typeof e)throw new Error;var i=n.namespace(t);return this.tween(r,(i.local?g:b)(i,e))},rt=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?A:x)(n,t)):l(this.node(),n).delay},it=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?E:N)(n,t)):l(this.node(),n).duration},ot=function(t){var n=this._id;return arguments.length?this.each(S(n,t)):l(this.node(),n).ease},at=function(t){"function"!=typeof t&&(t=n.matcher(t));for(var e=this._groups,r=e.length,i=new Array(r),o=0;o<r;++o)for(var a,u=e[o],s=u.length,l=i[o]=[],f=0;f<s;++f)(a=u[f])&&t.call(a,a.__data__,f,u)&&l.push(a);return new I(i,this._parents,this._name,this._id)},ut=function(t){if(t._id!==this._id)throw new Error;for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),a=new Array(r),u=0;u<o;++u)for(var s,l=n[u],f=e[u],c=l.length,h=a[u]=new Array(c),d=0;d<c;++d)(s=l[d]||f[d])&&(h[d]=s);for(;u<r;++u)a[u]=n[u];return new I(a,this._parents,this._name,this._id)},st=function(t,n){var e=this._id;return arguments.length<2?l(this.node(),e).on.on(t):this.each(q(e,t,n))},lt=function(){return this.on("end.remove",C(this._id))},ft=function(t){var e=this._name,r=this._id;"function"!=typeof t&&(t=n.selector(t));for(var i=this._groups,o=i.length,a=new Array(o),u=0;u<o;++u)for(var s,f,c=i[u],h=c.length,d=a[u]=new Array(h),_=0;_<h;++_)(s=c[_])&&(f=t.call(s,s.__data__,_,c))&&("__data__"in s&&(f.__data__=s.__data__),d[_]=f,X(d[_],e,r,_,d,l(s,r)));return new I(a,this._parents,e,r)},ct=function(t){var e=this._name,r=this._id;"function"!=typeof t&&(t=n.selectorAll(t));for(var i=this._groups,o=i.length,a=[],u=[],s=0;s<o;++s)for(var f,c=i[s],h=c.length,d=0;d<h;++d)if(f=c[d]){for(var _,p=t.call(f,f.__data__,d,c),v=l(f,r),y=0,m=p.length;y<m;++y)(_=p[y])&&X(_,e,r,y,p,v);a.push(p),u.push(f)}return new I(a,u,e,r)},ht=n.selection.prototype.constructor,dt=function(){return new ht(this._groups,this._parents)},_t=function(t,n,e){var r="transform"==(t+="")?i.interpolateTransformCss:tt;return null==n?this.styleTween(t,P(t,r)).on("end.style."+t,O(t)):this.styleTween(t,"function"==typeof n?k(t,r,d(this,"style."+t,n)):j(t,r,n+""),e)},pt=function(t,n,e){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==n)return this.tween(r,null);if("function"!=typeof n)throw new Error;return this.tween(r,z(t,n,null==e?"":e))},vt=function(t){return this.tween("text","function"==typeof t?R(d(this,"text",t)):M(null==t?"":t+""))},yt=function(){for(var t=this._name,n=this._id,e=D(),r=this._groups,i=r.length,o=0;o<i;++o)for(var a,u=r[o],s=u.length,f=0;f<s;++f)if(a=u[f]){var c=l(a,n);X(a,t,e,f,u,{time:c.time+c.delay+c.duration,delay:0,duration:c.duration,ease:c.ease})}return new I(r,this._parents,t,e)},mt=0,wt=n.selection.prototype;I.prototype=B.prototype={constructor:I,select:ft,selectAll:ct,filter:at,merge:ut,selection:dt,transition:yt,call:wt.call,nodes:wt.nodes,node:wt.node,size:wt.size,empty:wt.empty,each:wt.each,on:st,attr:nt,attrTween:et,style:_t,styleTween:pt,text:vt,remove:lt,tween:$,delay:rt,duration:it,ease:ot};var gt={time:null,delay:0,duration:250,ease:a.easeCubicInOut},bt=function(t){var n,e;t instanceof I?(n=t._id,t=t._name):(n=D(),(e=gt).time=r.now(),t=null==t?null:t+"");for(var i=this._groups,o=i.length,a=0;a<o;++a)for(var u,s=i[a],l=s.length,f=0;f<l;++f)(u=s[f])&&X(u,t,n,f,s,e||F(u,n));return new I(i,this._parents,t,n)};n.selection.prototype.interrupt=Z,n.selection.prototype.transition=bt;var At=[null],xt=function(t,n){var e,r,i=t.__transition;if(i){n=null==n?null:n+"";for(r in i)if((e=i[r]).state>K&&e.name===n)return new I([[t]],At,n,+r)}return null};t.transition=B,t.active=xt,t.interrupt=Y,Object.defineProperty(t,"__esModule",{value:!0})});
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
                        this.animation = true;
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
                        var right_container = document.createElement("div");
                        right_container.className = "right_container";
                        var reste_value = document.createElement("div");
                        reste_value.className = "reste_value";
                        this.reste_text = reste_value.appendChild(document.createTextNode(""));
                        right_container.appendChild(reste_value);
                        var reste_legend = document.createElement("div");
                        reste_legend.className = "reste_legend";
                        reste_legend.appendChild(document.createTextNode("Reste à faire"));
                        right_container.appendChild(reste_legend);
                        this.bottom_container = document.createElement("div");
                        this.bottom_container.className = "container_bottom";
                        var ptpassage_value = document.createElement("div");
                        ptpassage_value.className = "ptpassage_value";
                        this.ptpassage_text = ptpassage_value.appendChild(document.createTextNode("0"));
                        this.bottom_container.appendChild(ptpassage_value);
                        var ptpassage_legend = document.createElement("div");
                        ptpassage_legend.className = "ptpassage_legend";
                        ptpassage_legend.appendChild(document.createTextNode("Point de passage"));
                        this.bottom_container.appendChild(ptpassage_legend);
                        infos_container.appendChild(left_container);
                        infos_container.appendChild(right_container);
                        options.element.appendChild(infos_container);
                        this.svg = d3.select(options.element).append('svg');
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
                            .attr("width", 2);
                        this.objectif_text = this.gcontainer
                            .append('g')
                            .selectAll('text')
                            .data([''])
                            .enter()
                            .append('text')
                            .attr("y", bar_height + 20)
                            .attr('text-anchor', 'middle');
                    }
                    Visual.prototype.update = function (options) {
                        var animation_duration = 500;
                        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        var value = +Visual.getvalue(options.dataViews[0].categorical, "measure");
                        var objectif_value = +Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
                        var pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
                        this.reste_text.textContent = objectif_value - value > 0 ? (objectif_value - value).toLocaleString() : "0";
                        this.percent_text.textContent = (value / objectif_value * 100).toFixed(0).toLocaleString() + "%";
                        this.svg.attr("height", 40);
                        this.svg.attr("width", options.viewport.width);
                        this.back_rectangle.data([options.viewport.width])
                            .attr("fill", this.settings.dataDisplay.backColor)
                            .attr("width", function (d) { return d; });
                        var value_position = options.viewport.width * value / 100 - options.viewport.width * 10 / 100;
                        var objectif_position = options.viewport.width * objectif_value / 100 - options.viewport.width * 10 / 100;
                        if (objectif_position < value_position) {
                            value_position = options.viewport.width - options.viewport.width * 10 / 100;
                            objectif_position = value_position * objectif_value / value;
                        }
                        else {
                            objectif_position = options.viewport.width - options.viewport.width * 10 / 100;
                            value_position = objectif_position * value / objectif_value;
                        }
                        if (!this.settings.dataDisplay.animation) {
                            animation_duration = 0;
                        }
                        this.front_rectangle.data([value_position])
                            .attr("fill", this.settings.dataDisplay.fill)
                            .transition()
                            .duration(animation_duration)
                            .attr("width", function (d) { return d; });
                        this.objectif_rectangle.data([objectif_position])
                            .transition()
                            .duration(animation_duration)
                            .attr("x", function (d) { return d; });
                        this.objectif_text.data([objectif_value])
                            .text(function (d) { return d.toLocaleString(); })
                            .transition()
                            .duration(animation_duration)
                            .attr('x', objectif_position);
                        this.value_text.textContent = value.toLocaleString();
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
            plugins.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5_DEBUG = {
                name: 'pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5_DEBUG',
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