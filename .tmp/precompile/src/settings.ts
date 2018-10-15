module powerbi.extensibility.visual.pbiflatprogress111DDC2C0F0D0384236A63C11C134C5CDB5  {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public dataDisplay: dataDisplaySettings = new dataDisplaySettings();
    public dataOption: dataOptionSettings = new dataOptionSettings();
  }

  export class dataDisplaySettings {
    public backColor: string = "#D3D3D3";
    public fill: string = "#16B1E6";
    public animation: boolean = true;
  }

  export class dataOptionSettings {
    public ptPassage: boolean = true;
    public prctMode: boolean = false;
  }
}
