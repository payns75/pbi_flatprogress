module powerbi.extensibility.visual {
    "use strict";

    export class Visual implements IVisual {
        private visual_top: HTMLDivElement;
        private settings: VisualSettings;
        private engine: DomEngine;

        constructor(options: VisualConstructorOptions) {
            this.visual_top = document.createElement("div");
            this.visual_top.className = "visual_top";
            options.element.appendChild(this.visual_top);

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
            this.engine = new DomEngine(this.visual_top);
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