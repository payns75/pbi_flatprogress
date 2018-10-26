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
    public bar_height: number = 30;
    public horizontal_margin: number = 30;
    public realisation_text: string = "Réalisation";
    public resteafaire_text: string = "Reste à faire";
    public ptpassage_text: string = "Point de passage";
    public ptpassage_color: string = "#9c27b0";
    public objectif_text: string = "Objectif:";
    public objectif_color: string = "#1b5e20";
  }

  export class dataOptionSettings {
    public ptPassage: boolean = true;
    public prctMode: boolean = false;
  }
}
