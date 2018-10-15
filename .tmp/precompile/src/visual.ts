module powerbi.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5  {
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
        private bottom_container: HTMLElement;
        private ptpassage_text: Text;

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
            this.percent_text = percent_value.appendChild(document.createTextNode(""));
            left_container.appendChild(percent_value);

            const right_container: HTMLElement = document.createElement("div");
            right_container.className = "right_container";

            const reste_value: HTMLElement = document.createElement("div");
            reste_value.className = "reste_value";
            this.reste_text = reste_value.appendChild(document.createTextNode(""));
            right_container.appendChild(reste_value);

            const reste_legend: HTMLElement = document.createElement("div");
            reste_legend.className = "reste_legend";
            reste_legend.appendChild(document.createTextNode("Reste à faire"));
            right_container.appendChild(reste_legend);

            this.bottom_container = document.createElement("div");
            this.bottom_container.className = "container_bottom";

            const ptpassage_value: HTMLElement = document.createElement("div");
            ptpassage_value.className = "ptpassage_value";
            this.ptpassage_text = ptpassage_value.appendChild(document.createTextNode("0"));
            this.bottom_container.appendChild(ptpassage_value);

            const ptpassage_legend: HTMLElement = document.createElement("div");
            ptpassage_legend.className = "ptpassage_legend";
            ptpassage_legend.appendChild(document.createTextNode("Point de passage"));
            this.bottom_container.appendChild(ptpassage_legend);

            infos_container.appendChild(left_container);
            infos_container.appendChild(right_container);
            options.element.appendChild(infos_container);
            this.svg = d3.select(options.element).append('svg');
            options.element.appendChild(this.bottom_container);

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
            let animation_duration = 500;
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            const value = +Visual.getvalue(options.dataViews[0].categorical, "measure");
            const objectif_value = +Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
            const pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");

            this.reste_text.textContent = objectif_value - value > 0 ? (objectif_value - value).toLocaleString() : "0";
            this.percent_text.textContent = (value / objectif_value * 100).toFixed(0).toLocaleString() + "%";

            this.svg.attr("height", 40);
            this.svg.attr("width", options.viewport.width);

            this.back_rectangle.data([options.viewport.width])
                .attr("fill", this.settings.dataDisplay.backColor)
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

            if(!this.settings.dataDisplay.animation){
                animation_duration = 0;
            }

            this.front_rectangle.data([value_position])
                .attr("fill", this.settings.dataDisplay.fill)
                .transition()
                .duration(animation_duration)
                .attr("width", d => d);
                
            this.objectif_rectangle.data([objectif_position])
                .transition()
                .duration(animation_duration)
                .attr("x", d => d);
                
            this.objectif_text.data([objectif_value])
                .text(d => d.toLocaleString())
                .transition()
                .duration(animation_duration)
                .attr('x', objectif_position);

            this.value_text.textContent = value.toLocaleString();

            this.bottom_container.className = this.settings.dataOption.ptPassage && pt_passage_value ? "container_bottom" : "none";
            this.ptpassage_text.textContent = pt_passage_value.toLocaleString();
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