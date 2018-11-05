module powerbi.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5  {
    "use strict";

    export class DomManipulation {
        private data: any = {};

        constructor(public element: HTMLElement){
            const nodes = element.querySelectorAll("*");

            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id) {
                    this.data[nodes[i].id] = nodes[i];
                }
            }
        }

        private getvalue = (item, name) => {
            return item[name] && typeof (item[name]) === "function" ? item[name]() : item[name];
        }

        public update(vm){
            vm.forEach(item => {
                const el = <HTMLElement>this.data[item.id];
                let visible = false;

                if (item["visible"] !== undefined) {
                    el.style.visibility = this.getvalue(item, "visible") ? "visible" : "collapse";
                    visible = true;
                } else {
                    visible = true;
                }

                if (visible) {
                    if (item["value"] !== undefined) {
                        const value = this.getvalue(item, "value");
                        el.innerHTML = value ? String(value) : "";
                    }

                    if (item["attr"] !== undefined) {
                        for (var attr_name in item["attr"]) {
                            const v = this.getvalue(item["attr"], attr_name);

                            if (this.getvalue(item["attr"], attr_name)) {
                                el.setAttribute(attr_name, v);
                            } else {
                                el.removeAttribute(attr_name);
                            }
                        }
                    }

                    if (item["style"] !== undefined) {
                        for (var style_name in item["style"]) {
                            const v = this.getvalue(item["style"], style_name);
                            el.style[style_name] = v ? v : "";
                        }
                    }
                }
            });
        }
    }

    export class Visual implements IVisual {
        private visual_top: HTMLDivElement;
        // private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        // private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        // private back_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        // private back_rectangle: HTMLElement;
        // private front_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        // private objectif_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        // private objectif_triangle: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;
        // private objectif_text: d3.Selection<d3.BaseType, string, d3.BaseType, {}>;
        // private zero_text: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;
        // private right_container: HTMLElement;
        // private value_text: Text;
        // private value_text_libelle: Text;
        // private percent_text: Text;
        // private reste_text: Text;
        // private reste_libelle: Text;
        /*  private bottom_container: HTMLElement;
         private ptpassage_container: HTMLElement;
         private ptpassage_text: Text;
         private ptpassage_libelle: Text; */
        // private ptpassage_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;

        // private data: any = {};
        engine: DomManipulation;

        constructor(options: VisualConstructorOptions) {
            this.visual_top = document.createElement("div");
            this.visual_top.className = "visual_top";
            options.element.appendChild(this.visual_top);

            // const infos_container: HTMLElement = document.createElement("div");
            // infos_container.className = "container";

            const infos_container_html = `
                <div class="container">
                    <div class="left_container">
                        <div class="current_value_container">
                            <div id="current_value_libelle" class="current_value_libelle"></div>
                            <div id="current_value" class="current_value"></div>
                        </div>
                        <div id="percent_value" class="percent_value"></div>
                    </div>
                    <div class="right_container">
                        <div id="reste_value" class="reste_value"></div>
                        <div id="reste_legend" class="reste_legend"></div>
                    </div>
                </div>
                <svg id="svg">
                    <rect id="back_rectangle"></rect>
                    <rect id="front_rectangle"></rect>
                    <line id="objectif_rectangle" width="3" y1="0" stroke-width="1"></line>
                    <text id="zero_text" text-anchor="right">0</text>
                    <polygon id="objectif_triangle" points="0 0,7 10,-7 10"></polygon>
                    <text id="objectif_text"></text>
                    <line id="ptpassage_rectangle" y1="0" stroke-width="3" stroke-dasharray="5,5"></line>
                </svg>
                <div id="ptpassage_container" class="ptpassage_container">
                    <div id="ptpassage_value" class="ptpassage_value"></div>
                    <div id="ptpassage_legend" class="ptpassage_legend"></div>
                </div>
            `;

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

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            this.visual_top.setAttribute("style", `height:${options.viewport.height}px;margin: 0 ${this.settings.dataDisplay.horizontal_margin}px`);
            const gwidth = this.visual_top.clientWidth;
            const svg_bottom_height = 36;
            const _settings = this.settings;

            const value = Visual.getvalue(options.dataViews[0].categorical, "measure");
            const objectif_value = Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
            const pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
            const todo_measure = +Visual.getvalue(options.dataViews[0].categorical, "todo_measure");
            const prct_measure = Visual.getvalue(options.dataViews[0].categorical, "prct_measure");

            const front_total_width = gwidth - gwidth * 10 / 100;
            let value_position = 0;
            let objectif_position = 0;

            if (objectif_value < value) {
                value_position = front_total_width;
                objectif_position = objectif_value / value * front_total_width;
            } else {
                value_position = value / objectif_value * front_total_width;
                objectif_position = front_total_width;
            }

            const ptpassage_position = pt_passage_value / objectif_value * objectif_position;

            const vm = [{
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
                        return `${((+prct_measure).toFixed(0)).toLocaleString()}%`;
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
                        return `translate(${objectif_position},${(_settings.dataDisplay.bar_height + 2)})`;
                    },
                    fill: this.settings.dataDisplay.objectif_color
                }
            },
            {
                id: "objectif_text",
                visible: !!objectif_value,
                value: function () {
                    if (objectif_value) {
                        return `${_settings.dataDisplay.objectif_text} ${objectif_value.toLocaleString()}`;
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
                        let ptpassage_container_position = ptpassage_position - 150 / 2;
                        ptpassage_container_position = ptpassage_container_position < 0 ? 0 : ptpassage_container_position;
                        ptpassage_container_position = ptpassage_container_position > gwidth - 150 / 2 ? gwidth - 150 : ptpassage_container_position;

                        return `${ptpassage_container_position}px`;
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
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        public static getvalue(categorical: DataViewCategorical, name: string): any {
            const item = categorical.values.filter(f => f.source.roles[name]).map(m => m.values[0]);

            if (item && item.length === 1) {
                return item[0];
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}