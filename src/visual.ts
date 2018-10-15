module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        private back_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private front_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private objectif_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;
        private objectif_text: d3.Selection<d3.BaseType, string, d3.BaseType, {}>;
        private value_text: Text;
        private percent_text: Text;
        private reste_text: Text;

        constructor(options: VisualConstructorOptions) {
            const infos_container: HTMLElement = document.createElement("div");
            infos_container.className = "container";

            const left_container: HTMLElement = document.createElement("div");
            left_container.className = "left_container";

            const current_value: HTMLElement = document.createElement("div");
            current_value.className = "current_value";
            this.value_text = current_value.appendChild(document.createTextNode(""));
            left_container.appendChild(current_value);

            const percent_value: HTMLElement = document.createElement("div");
            percent_value.className = "percent_value";
            this.percent_text = percent_value.appendChild(document.createTextNode("120%"));
            left_container.appendChild(percent_value);

            const right_container: HTMLElement = document.createElement("div");
            right_container.className = "right_container";

            const reste_value: HTMLElement = document.createElement("div");
            reste_value.className = "reste_value";
            this.reste_text = reste_value.appendChild(document.createTextNode("46"));
            right_container.appendChild(reste_value);

            const reste_legend: HTMLElement = document.createElement("div");
            reste_legend.className = "reste_legend";
            reste_legend.appendChild(document.createTextNode("Reste à faire"));
            right_container.appendChild(reste_legend);

            infos_container.appendChild(left_container);
            infos_container.appendChild(right_container);
            options.element.appendChild(infos_container);
            this.svg = d3.select(options.element).append('svg');
            this.gcontainer = this.svg.append('g').classed('percenter', true);

            const bar_height = 20;

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

        public update(options: VisualUpdateOptions) {
            const animation_duration = 500;
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            const value = Visual.getvalue(options.dataViews[0].categorical, "measure") * 100;
            const objectif_value = Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");

            this.reste_text.textContent = objectif_value - value > 0 ? (objectif_value - value).toString() : "0";
            this.percent_text.textContent = (value / objectif_value * 100).toFixed(0).toString() + "%";

            this.svg.attr("height", options.viewport.height);
            this.svg.attr("width", options.viewport.width);

            this.back_rectangle.data([options.viewport.width])
                .attr("fill", "#e0e0e0")
                .attr("width", d => d);

            let value_position = options.viewport.width * value / 100 - options.viewport.width * 10 / 100;
            let objectif_position = options.viewport.width * objectif_value / 100 - options.viewport.width * 10 / 100;

            if (objectif_position < value_position) {
                value_position = options.viewport.width - options.viewport.width * 10 / 100;
                objectif_position = value_position * objectif_value / value;
            } else {
                objectif_position = options.viewport.width - options.viewport.width * 10 / 100;
                value_position = objectif_position * value / objectif_value;
            }

            this.front_rectangle.data([value_position])
                .attr("fill", "#2196F3")
                .transition()
                .duration(animation_duration)
                .attr("width", d => d);
                
            this.objectif_rectangle.data([objectif_position])
                .transition()
                .duration(animation_duration)
                .attr("x", d => d);
                
            this.objectif_text.data([objectif_value])
                .text(d => d)
                .transition()
                .duration(animation_duration)
                .attr('x', objectif_position);

            this.value_text.textContent = value.toString();
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