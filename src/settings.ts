module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public dataDisplay: dataDisplaySettings = new dataDisplaySettings();
    public dataOption: dataOptionSettings = new dataOptionSettings();
  }

  export class dataDisplaySettings {
    public backColor: string = "#D3D3D3";
    public fill: string = "#16B1E6";
    public bar_height: number = 30;
  }

  export class dataOptionSettings {
    public ptPassage: boolean = true;
    public prctMode: boolean = false;
  }
}
