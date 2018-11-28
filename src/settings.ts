module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public dataDisplay: dataDisplaySettings = new dataDisplaySettings();
    public dataOption: dataOptionSettings = new dataOptionSettings();
    public realisation: RealisationSettings = new RealisationSettings();
    public objectifs: ObjectifSettings = new ObjectifSettings();
    public todo: TodoSettings = new TodoSettings();
    public ptPassage: PtPassageSettings = new PtPassageSettings();
  }

  export class dataDisplaySettings {
    public backColor: string = "#D3D3D3";
    public fill: string = "#16B1E6";
    public bar_height: number = 30;
    public horizontal_margin: number = 30;
  }

  export class dataOptionSettings {
    public rstAFaire: boolean = true;0
    public prctMode: boolean = false;
    public prctMultiPlicateur: boolean = false;
    public calculAuto: boolean = false;
  }

  export  class PtPassageSettings {
    public show: boolean = true;
    public ptpassage_color: string = "#003C82";
    public ptpassage_decimal: number = 0;
    public fontFamily: string = "\"Segoe UI Bold\", wf_segoe-ui_bold, helvetica, arial, sans-serif";
    public ptpassage_text: string = "Point de passage";
    public ptpassage_libelle_size: number = 16;
    public ptpassage_libelle_bold: boolean = false;
    public ptpassage_value_size: number = 36;
    public ptpassage_value_bold: boolean = false;
  }

  export class RealisationSettings {
    public fontFamily: string = "\"Segoe UI Bold\", wf_segoe-ui_bold, helvetica, arial, sans-serif";
    public realisation_text: string = "Réalisation";
    public realisation_libelle_size: number = 16;
    public realisation_libelle_bold: boolean = false;
    public realisation_libelle_color: string = "#003C82";
    public realisation_decimal: number = 0;
    public realisation_font_size: number = 61;
    public realisation_color: string = "#000";
    public realisation_bold: boolean = false;
    public realisation_prct_decimal: number = 0;
    public realisation_prct_font_size: number = 25;
    public realisation_prct_color: string = "#000";
    public realisation_prct_bold: boolean = false;
  }

  export class ObjectifSettings {
    public fontFamily: string = "\"Segoe UI Bold\", wf_segoe-ui_bold, helvetica, arial, sans-serif";
    public objectif_decimals: number = 0;
    public objectif_text: string = "Objectif:";
    public objectif_color: string = "#1b5e20";
    public objectif_bold: boolean = false;
    public objectif_font_size: number = 16;
    public objectif_bottom_size: number = 36;
  }

  export class TodoSettings {
    public fontFamily: string = "\"Segoe UI Bold\", wf_segoe-ui_bold, helvetica, arial, sans-serif";
    public resteafaire_text: string = "Reste à faire";

    public resteafaire_color: string = "#424242";
    public resteafaire_decimal: number = 0;

    public resteafaire_libelle_size: number = 16;
    public resteafaire_libelle_bold: boolean = false;
    
    public resteafaire_value_size: number = 36;
    public resteafaire_value_bold: boolean = false;
  }
}
