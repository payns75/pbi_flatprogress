module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private visual_top: HTMLDivElement;
        private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        private back_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private front_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private objectif_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private objectif_triangle: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;
        private objectif_text: d3.Selection<d3.BaseType, string, d3.BaseType, {}>;
        private zero_text: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;
        private right_container: HTMLElement;
        private value_text: Text;
        private value_text_libelle: Text;
        private percent_text: Text;
        private reste_text: Text;
        private reste_libelle: Text;
        private bottom_container: HTMLElement;
        private ptpassage_container: HTMLElement;
        private ptpassage_text: Text;
        private ptpassage_libelle: Text;
        private ptpassage_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;

        constructor(options: VisualConstructorOptions) {
            this.visual_top = document.createElement("div");
            this.visual_top.className = "visual_top";
            options.element.appendChild(this.visual_top);

            const infos_container: HTMLElement = document.createElement("div");
            infos_container.className = "container";

            const left_container: HTMLElement = document.createElement("div");
            left_container.className = "left_container";

            const current_value_container: HTMLElement = document.createElement("div");
            current_value_container.className = "current_value_container";

            const current_value_libelle: HTMLElement = document.createElement("div");
            current_value_libelle.className = "current_value_libelle";
            this.value_text_libelle = current_value_libelle.appendChild(document.createTextNode(""));
            current_value_container.appendChild(current_value_libelle);

            const current_value: HTMLElement = document.createElement("div");
            current_value.className = "current_value";
            this.value_text = current_value.appendChild(document.createTextNode(""));
            current_value_container.appendChild(current_value);

            left_container.appendChild(current_value_container);

            const percent_value: HTMLElement = document.createElement("div");
            percent_value.className = "percent_value";
            this.percent_text = percent_value.appendChild(document.createTextNode(""));
            left_container.appendChild(percent_value);

            this.right_container = document.createElement("div");
            this.right_container.className = "none";

            const reste_value: HTMLElement = document.createElement("div");
            reste_value.className = "reste_value";
            this.reste_text = reste_value.appendChild(document.createTextNode(""));
            this.right_container.appendChild(reste_value);

            const reste_legend: HTMLElement = document.createElement("div");
            reste_legend.className = "reste_legend";
            this.reste_libelle = reste_legend.appendChild(document.createTextNode(""));
            this.right_container.appendChild(reste_legend);

            this.bottom_container = document.createElement("div");
            this.bottom_container.className = "none";

            this.ptpassage_container = document.createElement("div");
            this.ptpassage_container.className = "ptpassage_container";
            this.bottom_container.appendChild(this.ptpassage_container);

            const ptpassage_value: HTMLElement = document.createElement("div");
            ptpassage_value.className = "ptpassage_value";
            this.ptpassage_text = ptpassage_value.appendChild(document.createTextNode("0"));
            this.ptpassage_container.appendChild(ptpassage_value);

            const ptpassage_legend: HTMLElement = document.createElement("div");
            ptpassage_legend.className = "ptpassage_legend";
            this.ptpassage_libelle = ptpassage_legend.appendChild(document.createTextNode(""));
            this.ptpassage_container.appendChild(ptpassage_legend);

            infos_container.appendChild(left_container);
            infos_container.appendChild(this.right_container);
            this.visual_top.appendChild(infos_container);

            this.svg = d3.select(this.visual_top).append('svg');
            this.visual_top.appendChild(this.bottom_container);

            this.gcontainer = this.svg.append('g').classed('percenter', true);

            this.back_rectangle = this.gcontainer
                .append('g')
                .selectAll('rect')
                .data([this.visual_top.offsetWidth])
                .enter()
                .append("rect");

            this.front_rectangle = this.gcontainer
                .append('g')
                .selectAll('rect')
                .data([0])
                .enter()
                .append("rect");

            this.objectif_rectangle = this.gcontainer
                .append('g')
                .selectAll('line')
                .data([0])
                .enter()
                .append("line")
                .attr('y1', 0)
                .style("stroke-width", "1")
                .attr("width", 3)
                .classed("none", true);

            this.objectif_triangle = this.gcontainer
                .append('g')
                .append('path')
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(100))
                .attr("transform", function (d) { return "translate(" + 10 + "," + 10 + ")"; });

            this.objectif_text = this.gcontainer
                .append('g')
                .selectAll('text')
                .data([''])
                .enter()
                .append('text');

            this.zero_text = this.gcontainer
                .append('g')
                .append('text')
                .text("0")
                .attr('text-anchor', 'right')
                .classed("none", true);

            this.ptpassage_rectangle = this.gcontainer
                .append('g')
                .selectAll('line')
                .data([0])
                .enter()
                .append("line")
                .attr('y1', 0)
                .style("stroke-width", "3")
                .style("stroke-dasharray", "5,5")
                .classed("none", true);
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            this.visual_top.setAttribute("style", `height:${options.viewport.height}px;margin: 0 ${this.settings.dataDisplay.horizontal_margin}px`);
            const gwidth = this.visual_top.clientWidth;
            const svg_bottom_height = 36;

            const _settings = this.settings;
            const value = +Visual.getvalue(options.dataViews[0].categorical, "measure");
            const objectif_value = +Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
            const pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");

            const todo_measure = +Visual.getvalue(options.dataViews[0].categorical, "todo_measure");
            const prct_measure = +Visual.getvalue(options.dataViews[0].categorical, "prct_measure");
            const prctbar_measure = +Visual.getvalue(options.dataViews[0].categorical, "prctbar_measure");

            this.svg
                .attr("width", gwidth)
                .attr("height", this.settings.dataDisplay.bar_height + svg_bottom_height);

            this.back_rectangle.data([gwidth])
                .attr("fill", this.settings.dataDisplay.backColor)
                .attr("width", d => d)
                .attr("height", this.settings.dataDisplay.bar_height);

            this.value_text_libelle.textContent = this.settings.dataDisplay.realisation_text;
            this.value_text.textContent = value.toLocaleString();
            let value_position = gwidth * value / 100 - gwidth * 10 / 100;

            let objectif_position = 0;

            if (objectif_value) {
                this.right_container.className = "right_container";
                this.reste_libelle.textContent = this.settings.dataDisplay.resteafaire_text;
                this.reste_text.textContent = objectif_value - value > 0 ? (objectif_value - value).toLocaleString() : "0";
                this.percent_text.textContent = `${(+(value / objectif_value * 100).toFixed(0)).toLocaleString()}%`;

                objectif_position = gwidth * objectif_value / 100 - gwidth * 10 / 100;

                if (objectif_position < value_position) {
                    value_position = gwidth - gwidth * 10 / 100;
                    objectif_position = value_position * objectif_value / value;
                } else {
                    objectif_position = gwidth - gwidth * 10 / 100;
                    value_position = objectif_position * value / objectif_value;
                }

                this.front_rectangle.data([value_position])
                    .attr("fill", this.settings.dataDisplay.fill)
                    .attr("width", d => d)
                    .attr("height", this.settings.dataDisplay.bar_height);

                this.zero_text.classed("none", objectif_position < 15);
                this.zero_text.attr("y", this.settings.dataDisplay.bar_height + svg_bottom_height)

                this.objectif_rectangle.classed("none", false);
                this.objectif_rectangle.data([objectif_position])
                    .attr("x1", d => d)
                    .attr("x2", d => d)
                    .attr("y2", this.settings.dataDisplay.bar_height)
                    .attr("stroke", this.settings.dataDisplay.objectif_color);

                this.objectif_triangle.classed("none", false);
                this.objectif_triangle
                    .style("fill", this.settings.dataDisplay.objectif_color)
                    .attr("transform", function (d) { return "translate(" + objectif_position + "," + (_settings.dataDisplay.bar_height - 4 + 13) + ")"; });

                this.objectif_text.data([objectif_value])
                    .attr("text-anchor", objectif_position < 100 ? "right" : "middle")
                    .text(d => `${this.settings.dataDisplay.objectif_text} ${d.toLocaleString()}`)
                    .attr('x', objectif_position)
                    .attr("y", this.settings.dataDisplay.bar_height + svg_bottom_height - 4)
                    .style("fill", this.settings.dataDisplay.objectif_color);

                if (this.settings.dataOption.prctMode) {
                    this.right_container.className = "none";
                    this.percent_text.textContent = "";
                    this.objectif_text.text(`${this.objectif_text.text()}%`);
                    this.value_text.textContent += "%";
                }
            } else {
                this.front_rectangle.attr("width", "0");
                this.zero_text.classed("none", true);
                this.objectif_rectangle.classed("none", true);
                this.right_container.className = "none";
                this.objectif_text.text("");
                this.objectif_triangle.classed("none", true);
                this.percent_text.textContent = "";
            }

            this.ptpassage_rectangle.classed('none', true);
            let ptpassage_position = pt_passage_value / objectif_value * objectif_position;
            if (this.settings.dataOption.ptPassage && pt_passage_value) {
                this.bottom_container.className = "container_bottom";
                this.ptpassage_libelle.textContent = this.settings.dataDisplay.ptpassage_text;
                this.ptpassage_text.textContent = pt_passage_value.toLocaleString();

                if (ptpassage_position) {
                    this.ptpassage_rectangle.classed('none', false);
                    this.ptpassage_rectangle.data([ptpassage_position])
                        .attr('y2', this.settings.dataDisplay.bar_height + svg_bottom_height)
                        .attr("x1", d => d)
                        .attr("x2", d => d)
                        .attr("stroke", this.settings.dataDisplay.ptpassage_color);

                    let ptpassage_container_position = ptpassage_position - 150 / 2;
                    ptpassage_container_position = ptpassage_container_position < 0 ? 0 : ptpassage_container_position;
                    ptpassage_container_position = ptpassage_container_position > gwidth - 150 / 2 ? gwidth - 150 : ptpassage_container_position;

                    this.ptpassage_container.setAttribute("style", `margin-left: ${ptpassage_container_position}px;color:${this.settings.dataDisplay.ptpassage_color}`)
                }
            } else {
                this.bottom_container.className = "none";
            }
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