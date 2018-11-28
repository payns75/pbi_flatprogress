var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){function e(t,e,a){void 0===t&&(t=[]);var s=t;return i(s),e&&(s.identityFields=e),a&&(s.source=a),s}function i(t,e){t.grouped=e?function(){return e}:function(){return a(t)}}function a(t){for(var e,i=[],a=0,s=t.length;s>a;a++){var n=t[a];if(!e||e.identity!==n.identity){if(e={values:[]},n.identity){e.identity=n.identity;var r=n.source;void 0!==r.groupName?e.name=r.groupName:r.displayName&&(e.name=r.displayName)}i.push(e)}e.values.push(n)}return i}t.createValueColumns=e,t.setGrouped=i,t.groupValues=a}(e=t.DataViewTransform||(t.DataViewTransform={}))}(e=t.dataview||(t.dataview={}))}(e=t.utils||(t.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){function e(t,e){if(!t||!t.length)return-1;var i=t[0];if(i.values&&i.values.length>0)for(var s=0,n=i.values.length;n>s;++s){var r=i.values[s];if(r&&r.source&&a(r.source,e))return s}return-1}function i(t,e){if(t&&t.length)for(var i=0,s=t.length;s>i;i++)if(a(t[i].source,e))return i;return-1}function a(t,e){var i=t.roles;return i&&i[e]}function s(t,e){return null!=t&&null!=t.metadata&&t.metadata.columns&&t.metadata.columns.some(function(t){return t.roles&&void 0!==t.roles[e]})}function n(t,e){return t&&t.source&&t.source.roles&&t.source.roles[e]===!0}t.getMeasureIndexOfRole=e,t.getCategoryIndexOfRole=i,t.hasRole=a,t.hasRoleInDataView=s,t.hasRoleInValueColumn=n}(e=t.DataRoleHelper||(t.DataRoleHelper={}))}(e=t.dataview||(t.dataview={}))}(e=t.utils||(t.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){function e(t,e,i){if(!t)return i;var a=t[e];return void 0===a?i:a}function i(t,i,a){var s=e(t,i);return s&&s.solid?s.solid.color:a}t.getValue=e,t.getFillColorByPropertyName=i}(e=t.DataViewObject||(t.DataViewObject={}))}(e=t.dataview||(t.dataview={}))}(e=t.utils||(t.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){var e;!function(e){function i(e,i,a){return e?t.DataViewObject.getValue(e[i.objectName],i.propertyName,a):a}function a(t,e,i){return t&&t[e]?t[e]:i}function s(t,e,a){var s=i(t,e);return s&&s.solid?s.solid.color:a}function n(t,e,a){var s=i(t,e,a);return s&&s.solid?s.solid.color:void 0===s||null===s||"object"==typeof s&&!s.solid?a:s}e.getValue=i,e.getObject=a,e.getFillColor=s,e.getCommonValue=n}(e=t.DataViewObjects||(t.DataViewObjects={}))}(e=t.dataview||(t.dataview={}))}(e=t.utils||(t.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(e){var i;!function(e){var i;!function(e){var i,a=t.extensibility.utils.dataview.DataRoleHelper;!function(t){function e(t,e,i){if(t.categories&&t.categories.length>0){var s=t.categories[0];return s.source&&a.hasRole(s.source,e)&&a.hasRole(s.source,i)}return!1}function i(t){return void 0!==t.groupName?t.groupName:t.queryName}function s(t){var e=r(t);return null!=e&&e.imageUrl===!0}function n(t){var e=r(t);return null!=e&&e.webUrl===!0}function r(t){return t&&t.type&&t.type.misc}function o(t){return t&&t.metadata&&t.metadata.columns&&t.metadata.columns.length?t.metadata.columns.some(function(t){return s(t)===!0}):!1}t.categoryIsAlsoSeriesRole=e,t.getSeriesName=i,t.isImageUrlColumn=s,t.isWebUrlColumn=n,t.getMiscellaneousTypeDescriptor=r,t.hasImageUrlColumn=o}(i=e.converterHelper||(e.converterHelper={}))}(i=e.dataview||(e.dataview={}))}(i=e.utils||(e.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){var e=function(){function e(){}return e.getDefault=function(){return new this},e.createPropertyIdentifier=function(t,e){return{objectName:t,propertyName:e}},e.parse=function(e){var i,a=this.getDefault();if(!e||!e.metadata||!e.metadata.objects)return a;i=a.getProperties();for(var s in i)for(var n in i[s]){var r=a[s][n];a[s][n]=t.DataViewObjects.getCommonValue(e.metadata.objects,i[s][n],r)}return a},e.isPropertyEnumerable=function(t){return!e.InnumerablePropertyPrefix.test(t)},e.enumerateObjectInstances=function(t,e){var i=t&&t[e.objectName];if(!i)return[];var a={objectName:e.objectName,selector:null,properties:{}};for(var s in i)i.hasOwnProperty(s)&&(a.properties[s]=i[s]);return{instances:[a]}},e.prototype.getProperties=function(){var t=this,i={},a=Object.keys(this);return a.forEach(function(a){if(e.isPropertyEnumerable(a)){var s=Object.keys(t[a]);i[a]={},s.forEach(function(t){e.isPropertyEnumerable(a)&&(i[a][t]=e.createPropertyIdentifier(a,t))})}}),i},e}();e.InnumerablePropertyPrefix=/^_/,t.DataViewObjectsParser=e}(e=t.dataview||(t.dataview={}))}(e=t.utils||(t.utils={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var d3=window.d3,__extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function a(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(a.prototype=i.prototype,new a)}}(),powerbi;!function(t){var e;!function(e){var i;!function(e){var i;!function(e){"use strict";var i=t.extensibility.utils.dataview.DataViewObjectsParser,a=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.dataDisplay=new s,e.dataOption=new n,e.realisation=new o,e.objectifs=new l,e.todo=new u,e.ptPassage=new r,e}return __extends(e,t),e}(i);e.VisualSettings=a;var s=function(){function t(){this.backColor="#D3D3D3",this.fill="#16B1E6",this.bar_height=30,this.horizontal_margin=30}return t}();e.dataDisplaySettings=s;var n=function(){function t(){this.rstAFaire=!0,this.prctMode=!1,this.prctMultiPlicateur=!1,this.calculAuto=!1}return t}();e.dataOptionSettings=n;var r=function(){function t(){this.show=!0,this.ptpassage_color="#003C82",this.ptpassage_decimal=0,this.fontFamily='"Segoe UI Bold", wf_segoe-ui_bold, helvetica, arial, sans-serif',this.ptpassage_text="Point de passage",this.ptpassage_libelle_size=16,this.ptpassage_libelle_bold=!1,this.ptpassage_value_size=36,this.ptpassage_value_bold=!1}return t}();e.PtPassageSettings=r;var o=function(){function t(){this.fontFamily='"Segoe UI Bold", wf_segoe-ui_bold, helvetica, arial, sans-serif',this.realisation_text="Réalisation",this.realisation_libelle_size=16,this.realisation_libelle_bold=!1,this.realisation_libelle_color="#003C82",this.realisation_decimal=0,this.realisation_font_size=61,this.realisation_color="#000",this.realisation_bold=!1,this.realisation_prct_decimal=0,this.realisation_prct_font_size=25,this.realisation_prct_color="#000",this.realisation_prct_bold=!1}return t}();e.RealisationSettings=o;var l=function(){function t(){this.fontFamily='"Segoe UI Bold", wf_segoe-ui_bold, helvetica, arial, sans-serif',this.objectif_decimals=0,this.objectif_text="Objectif:",this.objectif_color="#1b5e20",this.objectif_bold=!1,this.objectif_font_size=16,this.objectif_bottom_size=36}return t}();e.ObjectifSettings=l;var u=function(){function t(){this.fontFamily='"Segoe UI Bold", wf_segoe-ui_bold, helvetica, arial, sans-serif',this.resteafaire_text="Reste à faire",this.resteafaire_color="#424242",this.resteafaire_decimal=0,this.resteafaire_libelle_size=16,this.resteafaire_libelle_bold=!1,this.resteafaire_value_size=36,this.resteafaire_value_bold=!1}return t}();e.TodoSettings=u}(i=e.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5||(e.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5={}))}(i=e.visual||(e.visual={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){this.element=t,this.data={},this.getvalue=function(t,e){return t[e]&&"function"==typeof t[e]?t[e]():t[e]},t.attributes;for(var e=t.querySelectorAll("*"),i=0;i<e.length;i++)e[i].id&&(this.data[e[i].id]=e[i])}return t.prototype.update=function(t){var e=this;t.forEach(function(t){var i=e.data[t.id],a=!1;if(void 0!==t.visible?(i.style.visibility=e.getvalue(t,"visible")?"visible":"collapse",a=!0):a=!0,a){if(void 0!==t.value){i.style.fontWeight;var s=e.getvalue(t,"value");i.innerHTML=s?String(s):""}if(void 0!==t.attr)for(var n in t.attr){var r=e.getvalue(t.attr,n);e.getvalue(t.attr,n)?i.setAttribute(n,r):i.removeAttribute(n)}if(void 0!==t.style)for(var o in t.style){var r=e.getvalue(t.style,o);i.style[o]=r?r:""}if(void 0!==t.svgtext){var r="function"==typeof t.svgtext?t.svgtext():t.svgtext;i.childNodes[0].nodeValue=r}}})},t}();t.DomEngine=e}(e=t.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5||(t.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5={}))}(e=t.visual||(t.visual={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(t){var e;!function(t){var e;!function(t){"use strict";var e=function(){function e(e){try{this.visual_top=document.createElement("div"),this.visual_top.className="visual_top",e.element.appendChild(this.visual_top);var i='\n                <div class="container">\n                    <div class="left_container" id="left_container">\n                        <div class="current_value_container">\n                            <div id="current_value_libelle"></div>\n                            <div id="current_value"></div>\n                        </div>\n                        <div id="percent_value" class="percent_value"></div>\n                    </div>\n                    <div class="right_container" id="right_container">\n                        <div id="reste_value"></div>\n                        <div id="reste_legend"></div>\n                    </div>\n                </div>\n                <svg id="svg">\n                    <rect id="back_rectangle"></rect>\n                    <rect id="front_rectangle"></rect>\n                    <line id="objectif_rectangle" width="3" y1="0" stroke-width="1"></line>\n                    <text id="zero_text" text-anchor="right">0</text>\n                    <polygon id="objectif_triangle" points="0 0,7 10,-7 10"></polygon>\n                    <text id="objectif_text">t</text>\n                    <line id="ptpassage_rectangle" y1="0" stroke-width="3" stroke-dasharray="5,5"></line>\n                </svg>\n                <div id="ptpassage_container" class="ptpassage_container">\n                    <div id="ptpassage_value"></div>\n                    <div id="ptpassage_legend"></div>\n                </div>\n            ';this.visual_top.innerHTML=i,this.engine=new t.DomEngine(this.visual_top)}catch(a){console.error("Constructor Error",a)}}return e.prototype.update=function(t){var i=this;try{this.settings=e.parseSettings(t&&t.dataViews&&t.dataViews[0]),this.visual_top.setAttribute("style","height:"+t.viewport.height+"px;margin: 0 "+this.settings.dataDisplay.horizontal_margin+"px");var a=this.visual_top.clientWidth,s=this.settings,n=e.getvalue(t.dataViews[0].categorical,"measure"),r=e.getvalue(t.dataViews[0].categorical,"objectif_measure"),o=+e.getvalue(t.dataViews[0].categorical,"pt_passage_measure"),l=+e.getvalue(t.dataViews[0].categorical,"todo_measure"),u=+e.getvalue(t.dataViews[0].categorical,"prct_measure");if(this.settings.dataOption.calculAuto){r&&(u=n/r*100);var c=r-n;l=0>c?0:c}else u&&this.settings.dataOption.prctMultiPlicateur&&(u*=100);var f=a-10*a/100,p=0,d=0;n>r?(p=f,d=r/n*f):(p=u/100*f,d=f);var g=o/r*d,v=this.settings.dataOption.prctMode?" %":"",h=[{id:"left_container",style:{fontFamily:this.settings.realisation.fontFamily}},{id:"current_value_libelle",visible:!!this.settings.realisation.realisation_text&&!!n,value:this.settings.realisation.realisation_text,style:{color:this.settings.realisation.realisation_libelle_color,fontSize:this.settings.realisation.realisation_libelle_size+"px",fontWeight:this.settings.realisation.realisation_libelle_bold?"bold":"normal"}},{id:"current_value",visible:!!n,value:function(){if(n){var t=s.dataOption.prctMode&&s.dataOption.prctMultiPlicateur?100*n:+n;return t.toLocaleString(void 0,{minimumFractionDigits:s.realisation.realisation_decimal,maximumFractionDigits:s.realisation.realisation_decimal})+v}},style:{fontSize:this.settings.realisation.realisation_font_size+"px",color:this.settings.realisation.realisation_color,fontWeight:this.settings.realisation.realisation_bold?"bold":"normal"}},{id:"percent_value",visible:!!u&&!this.settings.dataOption.prctMode,value:function(){return u?(+u).toLocaleString(void 0,{minimumFractionDigits:s.realisation.realisation_prct_decimal,maximumFractionDigits:s.realisation.realisation_prct_decimal})+" %":void 0},style:{color:this.settings.realisation.realisation_prct_color,fontSize:this.settings.realisation.realisation_prct_font_size+"px",fontWeight:this.settings.realisation.realisation_prct_bold?"bold":"normal"}},{id:"right_container",style:{fontFamily:this.settings.todo.fontFamily,color:this.settings.todo.resteafaire_color}},{id:"reste_legend",visible:!!this.settings.todo.resteafaire_text&&(!!l||0===l)&&this.settings.dataOption.rstAFaire,value:this.settings.todo.resteafaire_text,style:{fontSize:this.settings.todo.resteafaire_libelle_size+"px",fontWeight:this.settings.todo.resteafaire_libelle_bold?"bold":"normal"}},{id:"reste_value",visible:(!!l||0===l)&&this.settings.dataOption.rstAFaire,value:function(){if(l||0===l){var t=s.dataOption.prctMode&&s.dataOption.prctMultiPlicateur?100*l:+l;return t.toLocaleString(void 0,{minimumFractionDigits:s.todo.resteafaire_decimal,maximumFractionDigits:s.todo.resteafaire_decimal})+v}},style:{fontSize:this.settings.todo.resteafaire_value_size+"px",fontWeight:this.settings.todo.resteafaire_value_bold?"bold":"normal"}},{id:"svg",attr:{width:a,height:this.settings.dataDisplay.bar_height+s.objectifs.objectif_bottom_size}},{id:"back_rectangle",attr:{width:a,height:this.settings.dataDisplay.bar_height,fill:this.settings.dataDisplay.backColor}},{id:"front_rectangle",attr:{width:p,height:this.settings.dataDisplay.bar_height,fill:this.settings.dataDisplay.fill}},{id:"zero_text",visible:d>15,attr:{y:this.settings.dataDisplay.bar_height+16}},{id:"objectif_rectangle",visible:!!r,attr:{x1:d,x2:d,y2:this.settings.dataDisplay.bar_height,stroke:this.settings.objectifs.objectif_color}},{id:"objectif_triangle",visible:!!r,attr:{transform:function(){return"translate("+d+","+(s.dataDisplay.bar_height+2)+")"},fill:this.settings.objectifs.objectif_color}},{id:"objectif_text",visible:!!r,attr:{"text-anchor":100>d?"right":"middle",fill:this.settings.objectifs.objectif_color,x:d,y:this.settings.dataDisplay.bar_height+s.objectifs.objectif_bottom_size-4},svgtext:function(){if(r){var t=s.dataOption.prctMode&&s.dataOption.prctMultiPlicateur?100*r:r;return s.objectifs.objectif_text+" "+t.toLocaleString(void 0,{minimumFractionDigits:s.objectifs.objectif_decimals,maximumFractionDigits:s.objectifs.objectif_decimals})+v}},style:{fontSize:this.settings.objectifs.objectif_font_size+"px",fontWeight:this.settings.objectifs.objectif_bold?"500":"100",fontFamily:this.settings.objectifs.fontFamily}},{id:"ptpassage_rectangle",visible:this.settings.ptPassage.show&&o,attr:{y2:this.settings.dataDisplay.bar_height+s.objectifs.objectif_bottom_size,x1:g,x2:g,stroke:this.settings.ptPassage.ptpassage_color}},{id:"ptpassage_value",visible:this.settings.ptPassage.show&&o,value:function(){if(o){var t=s.dataOption.prctMode&&s.dataOption.prctMultiPlicateur?100*o:+o;return t.toLocaleString(void 0,{minimumFractionDigits:s.ptPassage.ptpassage_decimal,maximumFractionDigits:s.ptPassage.ptpassage_decimal})+v}},style:{fontSize:this.settings.ptPassage.ptpassage_value_size+"px",fontWeight:this.settings.ptPassage.ptpassage_value_bold?"bold":"normal"}},{id:"ptpassage_legend",value:this.settings.ptPassage.ptpassage_text,style:{fontSize:this.settings.ptPassage.ptpassage_libelle_size+"px",fontWeight:this.settings.ptPassage.ptpassage_libelle_bold?"bold":"normal"}},{id:"ptpassage_container",style:{display:function(){return i.settings.ptPassage.show&&o?"block":"none"},color:this.settings.ptPassage.ptpassage_color,"margin-left":function(){var t=g-75;return t=0>t?0:t,t=t>a-75?a-150:t,t+"px"},fontFamily:this.settings.ptPassage.fontFamily}}];this.engine.update(h)}catch(b){console.error("Update error",b)}},e.parseSettings=function(e){return t.VisualSettings.parse(e)},e.getvalue=function(t,e){var i=t.values.filter(function(t){return t.source.roles[e]}).map(function(t){return t.values[0]});return i&&1===i.length?i[0]:void 0},e.prototype.enumerateObjectInstances=function(e){return t.VisualSettings.enumerateObjectInstances(this.settings||t.VisualSettings.getDefault(),e)},e}();t.Visual=e}(e=t.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5||(t.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5={}))}(e=t.visual||(t.visual={}))}(e=t.extensibility||(t.extensibility={}))}(powerbi||(powerbi={}));var powerbi;!function(t){var e;!function(e){var i;!function(e){e.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5={name:"pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5",displayName:"flatprogress","class":"Visual",version:"1.0.0",apiVersion:"1.11.0",create:function(e){return new t.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5.Visual(e)},custom:!0}}(i=e.plugins||(e.plugins={}))}(e=t.visuals||(t.visuals={}))}(powerbi||(powerbi={}));