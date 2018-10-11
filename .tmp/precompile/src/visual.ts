module powerbi.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5  {
    "use strict";
    export class Visual implements IVisual {
        private svg: d3.Selection<SVGElement>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<SVGElement>;
        private back_rectangle: any;
        private front_rectangle: any;

        constructor(options: VisualConstructorOptions) {
            this.svg = d3.select(options.element).append('svg');
            this.gcontainer = this.svg.append('g').classed('percenter', true);

            this.back_rectangle = this.gcontainer
                .append('g')
                .selectAll('rect')
                .data([options.element.offsetWidth])
                .enter()
                .append("rect")
                .attr("height", 50);

            this.front_rectangle = this.gcontainer
                .append('g')
                .selectAll('rect')
                .data([0])
                .enter()
                .append("rect")
                .attr("height", 50);
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            const value = Visual.getvalue(options.dataViews[0].categorical, "measure");

            this.svg.attr({
                height: options.viewport.height,
                width: options.viewport.width
            });

            this.back_rectangle.data([options.viewport.width])
                .attr("fill", "gray")
                .attr("width", d => d);

            this.front_rectangle.data([options.viewport.width * value])
                .attr("fill", "blue")
                .transition()
                .duration(1000)
                .attr("width", d => d);

            /* const back_rectangle = this.gcontainer.append("rect")
                .attr("width", options.viewport.width)
                .attr("height", 50)
                .attr("fill", "gray"); */

            /* const front_rectangle = this.gcontainer.append("rect")
                .attr("width", options.viewport.width / 2)
                .attr("height", 50)
                .attr("fill", "blue"); */
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