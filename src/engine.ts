module powerbi.extensibility.visual {
    "use strict";

    export class DomEngine {
        private data: any = {};

        constructor(public element: HTMLElement) {
            element.attributes
            const nodes = element.querySelectorAll("*");

            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id) {
                    this.data[nodes[i].id] = nodes[i];
                }
            }
        }

        private getvalue = function (item, name) {
            return item[name] && typeof (item[name]) === "function" ? item[name]() : item[name];
        };

        public update(vm) {
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
                    if (item["value"] !== undefined) {el.style.fontWeight
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

                    if (item["svgtext"] !== undefined) {
                        const v = typeof (item["svgtext"]) === "function" ? item["svgtext"]() : item["svgtext"];
                        el.childNodes[0].nodeValue = v;
                    }
                }
            });
        }
    }
}