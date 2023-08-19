import Model from "./Model";

export default class Project extends Model {
  key: string;
  DocEntry: string;
  DocNum: string;
  DocType: string;
  CardCode: string;
  CardName: string;
  JournalMemo: string;
  VATRegNum: string;
  DocTotal: string;
  Comments: string;
  DocDate: string;
  DocDueDate: string;
  DocumentStatus: string;
  CreationDate: string;
  UpdateDate: string;

  constructor(json: any) {
    super();

    this.key = json["DocEntry"];
    this.DocEntry = json["DocEntry"];
    this.DocNum = json["DocNum"];
    this.DocType = json["DocType"].split("_")[1];
    this.CardCode = json["CardCode"];
    this.CardName = json["CardName"];
    this.JournalMemo = json["JournalMemo"];
    this.VATRegNum = json["VATRegNum"];
    this.DocTotal = json["DocTotal"];
    this.Comments = json["Comments"];
    this.DocDate = json["DocDate"].split("T")[0];
    this.DocDueDate = json["DocDueDate"].split("T")[0];
    this.DocumentStatus = json["DocumentStatus"]
      .slice(1)
      .slice(1)
      .slice(1)
      .slice(1)
      .slice(1);
    this.CreationDate = json["CreationDate"];
    this.UpdateDate = json["UpdateDate"];
  }

  toJson(update: boolean) {
    throw new Error("Method not implemented.");
  }
}
