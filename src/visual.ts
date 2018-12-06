module powerbi.extensibility.visual {
    "use strict";

    export class Visual implements IVisual {
        private visual_top: HTMLDivElement;
        private settings: VisualSettings;
        private engine: DomEngine;

        constructor(options: VisualConstructorOptions) {
            try {
                this.visual_top = document.createElement("div");
                this.visual_top.className = "visual_top";
                options.element.appendChild(this.visual_top);

                const infos_container_html = `
                <div class="container">
                    <div class="left_container" id="left_container">
                        <div class="current_value_container">
                            <div id="current_value_libelle"></div>
                            <div id="current_value"></div>
                        </div>
                        <div id="percent_value" class="percent_value"></div>
                    </div>
                    <div class="right_container" id="right_container">
                        <div id="reste_value"></div>
                        <div id="reste_legend"></div>
                    </div>
                </div>
                <svg id="svg">
                    <rect id="back_rectangle"></rect>
                    <rect id="front_rectangle"></rect>
                    <line id="objectif_rectangle" width="3" y1="0" stroke-width="1"></line>
                    <text id="zero_text" text-anchor="right">0</text>
                    <polygon id="objectif_triangle" points="0 0,7 10,-7 10"></polygon>
                    <text id="objectif_text">t</text>
                    <line id="ptpassage_rectangle" y1="0" stroke-width="3" stroke-dasharray="5,5"></line>
                </svg>
                <div id="ptpassage_container" class="ptpassage_container">
                    <div id="ptpassage_value"></div>
                    <div id="ptpassage_legend"></div>
                    <div id="ptpassage_prct"></div>
                </div>
            `;

                this.visual_top.innerHTML = infos_container_html;
                this.engine = new DomEngine(this.visual_top);
            }
            catch (ex) {
                console.error('Constructor Error', ex);
            }
        }

        public update(options: VisualUpdateOptions) {
            try {
                this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                this.visual_top.setAttribute("style", `height:${options.viewport.height}px;margin: 0 ${this.settings.dataDisplay.horizontal_margin}px`);
                const gwidth = this.visual_top.clientWidth;
                const _settings = this.settings;

                const value = Visual.getvalue(options.dataViews[0].categorical, "measure");
                const objectif_value = Visual.getvalue(options.dataViews[0].categorical, "objectif_measure");
                const pt_passage_value = +Visual.getvalue(options.dataViews[0].categorical, "pt_passage_measure");
                let todo_measure = +Visual.getvalue(options.dataViews[0].categorical, "todo_measure");
                let prct_measure = +Visual.getvalue(options.dataViews[0].categorical, "prct_measure");
                let prct_passage_measure = +Visual.getvalue(options.dataViews[0].categorical, "prct_passage_measure");

                if (this.settings.dataOption.calculAuto) {
                    if (objectif_value) {
                        prct_measure = value / objectif_value * 100;
                    }

                    if(pt_passage_value){
                        prct_passage_measure = value / pt_passage_value * 100;
                    }

                    const tmp = objectif_value - value;
                    todo_measure = tmp < 0 ? 0 : tmp;
                } else {
                    if (prct_measure && this.settings.dataOption.prctMultiPlicateur) {
                        prct_measure *= 100;
                        prct_passage_measure *= 100;
                    }
                }

                const front_total_width = gwidth - gwidth * 10 / 100;
                let value_position = 0;
                let objectif_position = 0;

                if (objectif_value < value) {
                    value_position = front_total_width;
                    objectif_position = objectif_value / value * front_total_width;
                } else {
                    value_position = prct_measure / 100 * front_total_width;
                    objectif_position = front_total_width;
                }

                const ptpassage_position = pt_passage_value / objectif_value * objectif_position;
                const prctsuffix = this.settings.dataOption.prctMode ? ' %' : '';

                const vm = [{
                    id: "left_container",
                    style: {
                        fontFamily: this.settings.realisation.fontFamily
                    }
                },
                {
                    id: "current_value_libelle",
                    visible: !!this.settings.realisation.realisation_text && !!value,
                    value: this.settings.realisation.realisation_text,
                    style: {
                        color: this.settings.realisation.realisation_libelle_color,
                        fontSize: this.settings.realisation.realisation_libelle_size + "px",
                        fontWeight: this.settings.realisation.realisation_libelle_bold ? "bold" : "normal",
                        display: () => {
                            return this.settings.realisation.realisation_text_show ? "block" : "none";
                        },
                    }
                },
                {
                    id: "current_value",
                    visible: !!value,
                    value: () => {
                        if (value) {
                            const tmp = _settings.dataOption.prctMode && _settings.dataOption.prctMultiPlicateur ? value * 100 : +value;
                            return (tmp).toLocaleString(undefined, { minimumFractionDigits: _settings.realisation.realisation_decimal, maximumFractionDigits: _settings.realisation.realisation_decimal }) + prctsuffix;
                        }
                    },
                    style: {
                        fontSize: this.settings.realisation.realisation_font_size + "px",
                        color: this.settings.realisation.realisation_color,
                        fontWeight: this.settings.realisation.realisation_bold ? "bold" : "normal"
                    }
                },
                {
                    id: "percent_value",
                    visible: !!prct_measure && !this.settings.dataOption.prctMode,
                    value: () => {
                        if (prct_measure) {
                            return `${((+prct_measure)).toLocaleString(undefined, { minimumFractionDigits: _settings.realisation.realisation_prct_decimal, maximumFractionDigits: _settings.realisation.realisation_prct_decimal })} %`;
                        }
                    },
                    style: {
                        color: this.settings.realisation.realisation_prct_color,
                        fontSize: this.settings.realisation.realisation_prct_font_size + "px",
                        fontWeight: this.settings.realisation.realisation_prct_bold ? "bold" : "normal",
                        display: () => {
                            return this.settings.realisation.realisation_prct_show ? "block" : "none";
                        }
                    }
                },
                {
                    id: "right_container",
                    style: {
                        fontFamily: this.settings.todo.fontFamily,
                        color: this.settings.todo.resteafaire_color
                    }
                },
                {
                    id: "reste_legend",
                    visible: !!this.settings.todo.resteafaire_text
                        && (!!todo_measure || todo_measure === 0)
                        && this.settings.dataOption.rstAFaire,
                    value: this.settings.todo.resteafaire_text,
                    style: {
                        fontSize: this.settings.todo.resteafaire_libelle_size + "px",
                        fontWeight: this.settings.todo.resteafaire_libelle_bold ? "bold" : "normal"
                    }
                },
                {
                    id: "reste_value",
                    visible: (!!todo_measure || todo_measure === 0)
                        && this.settings.dataOption.rstAFaire,
                    value: () => {
                        if (todo_measure || todo_measure === 0) {
                            const tmp = _settings.dataOption.prctMode && _settings.dataOption.prctMultiPlicateur ? todo_measure * 100 : +todo_measure;
                            return (tmp).toLocaleString(undefined, { minimumFractionDigits: _settings.todo.resteafaire_decimal, maximumFractionDigits: _settings.todo.resteafaire_decimal }) + prctsuffix;
                        }
                    },
                    style: {
                        fontSize: this.settings.todo.resteafaire_value_size + "px",
                        fontWeight: this.settings.todo.resteafaire_value_bold ? "bold" : "normal"
                    }
                },
                {
                    id: "svg",
                    attr: {
                        width: gwidth,
                        height: this.settings.dataDisplay.bar_height + _settings.objectifs.objectif_bottom_size
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
                        stroke: this.settings.objectifs.objectif_color
                    }
                },
                {
                    id: "objectif_triangle",
                    visible: !!objectif_value,
                    attr: {
                        transform: () => {
                            return `translate(${objectif_position},${(_settings.dataDisplay.bar_height + 2)})`;
                        },
                        fill: this.settings.objectifs.objectif_color
                    }
                },
                {
                    id: "objectif_text",
                    visible: !!objectif_value,
                    attr: {
                        "text-anchor": objectif_position < 100 ? "right" : "middle",
                        fill: this.settings.objectifs.objectif_color,
                        x: objectif_position,
                        y: this.settings.dataDisplay.bar_height + _settings.objectifs.objectif_bottom_size - 4
                    },
                    svgtext: () => {
                        if (objectif_value) {
                            const tmp = _settings.dataOption.prctMode && _settings.dataOption.prctMultiPlicateur ? objectif_value * 100 : objectif_value;
                            return `${_settings.objectifs.objectif_text} ${tmp.toLocaleString(undefined, { minimumFractionDigits: _settings.objectifs.objectif_decimals, maximumFractionDigits: _settings.objectifs.objectif_decimals })}${prctsuffix}`;
                        }
                    },
                    style: {
                        fontSize: this.settings.objectifs.objectif_font_size + "px",
                        fontWeight: this.settings.objectifs.objectif_bold ? "500" : "100",
                        fontFamily: this.settings.objectifs.fontFamily,
                    }
                },
                {
                    id: "ptpassage_rectangle",
                    visible: this.settings.ptPassage.show && pt_passage_value,
                    attr: {
                        y2: this.settings.dataDisplay.bar_height + _settings.objectifs.objectif_bottom_size,
                        x1: ptpassage_position,
                        x2: ptpassage_position,
                        stroke: this.settings.ptPassage.ptpassage_color
                    }
                },
                {
                    id: "ptpassage_value",
                    visible: this.settings.ptPassage.show && pt_passage_value,
                    value: () => {
                        if (pt_passage_value) {
                            const tmp = _settings.dataOption.prctMode && _settings.dataOption.prctMultiPlicateur ? pt_passage_value * 100 : +pt_passage_value;
                            return tmp.toLocaleString(undefined, { minimumFractionDigits: _settings.ptPassage.ptpassage_decimal, maximumFractionDigits: _settings.ptPassage.ptpassage_decimal }) + prctsuffix;
                        }
                    },
                    style: {
                        fontSize: this.settings.ptPassage.ptpassage_value_size + "px",
                        fontWeight: this.settings.ptPassage.ptpassage_value_bold ? "bold" : "normal"
                    }
                },
                {
                    id: "ptpassage_prct",
                    visible: !!prct_passage_measure,
                    value: () => {
                        if (prct_measure) {
                            return `<b>${((+prct_passage_measure)).toLocaleString(undefined, { minimumFractionDigits: _settings.realisation.realisation_prct_decimal, maximumFractionDigits: _settings.realisation.realisation_prct_decimal })}%</b> ${this.settings.ptPassage.ptpassage_prct_text}`;
                        }
                    },
                    style: {
                        fontSize: this.settings.ptPassage.ptpassage_prct_font_size + "px",
                        display: () => {
                            return this.settings.ptPassage.ptpassage_prct_visible ? "block" : "none";
                        }
                    }
                },
                {
                    id: "ptpassage_legend",
                    value: this.settings.ptPassage.ptpassage_text,
                    style: {
                        fontSize: this.settings.ptPassage.ptpassage_libelle_size + "px",
                        fontWeight: this.settings.ptPassage.ptpassage_libelle_bold ? "bold" : "normal"
                    }
                },
                {
                    id: "ptpassage_container",
                    style: {
                        display: () => {
                            return this.settings.ptPassage.show && pt_passage_value ? "block" : "none";
                        },
                        color: this.settings.ptPassage.ptpassage_color,
                        "margin-left": () => {
                            let ptpassage_container_position = ptpassage_position - 150 / 2;
                            ptpassage_container_position = ptpassage_container_position < 0 ? 0 : ptpassage_container_position;
                            ptpassage_container_position = ptpassage_container_position > gwidth - 150 / 2 ? gwidth - 150 : ptpassage_container_position;

                            return `${ptpassage_container_position}px`;
                        },
                        fontFamily: this.settings.ptPassage.fontFamily,
                    }
                }];

                this.engine.update(vm);
            } catch (ex) {
                console.error('Update error', ex);
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
            const values = <any>VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);

            if (values.instances[0].objectName === 'realisation') {
                if (values.instances[0].properties.realisation_text_show === false) {
                    delete values.instances[0].properties.realisation_text;
                    delete values.instances[0].properties.realisation_libelle_size;
                    delete values.instances[0].properties.realisation_libelle_bold;
                    delete values.instances[0].properties.realisation_libelle_color;
                }

                if (values.instances[0].properties.realisation_prct_show === false) {
                    delete values.instances[0].properties.realisation_prct_decimal;
                    delete values.instances[0].properties.realisation_prct_font_size;
                    delete values.instances[0].properties.realisation_prct_color;
                    delete values.instances[0].properties.realisation_prct_bold;
                }
            }

            if (values.instances[0].objectName === 'ptPassage') {
                if (values.instances[0].properties.ptpassage_prct_visible === false) {
                    delete values.instances[0].properties.ptpassage_prct_text;
                    delete values.instances[0].properties.ptpassage_prct_font_size;
                }
            }

            return values;
        }
    }
}