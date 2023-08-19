import request from "@/utilies/request"

export default class DocumentSerieRepository {
  constructor() {}

  private static query = ["LastNumber", "Name", "PeriodIndicator", "BPLID"]
  private static filter = ["Locked eq 'tNO'"]

  public static async getDocumentSeries(document: any) {
    const payload = {
      DocumentTypeParams: document,
    }

    const response = await request(
      "POST",
      `/SeriesService_GetDocumentSeries?$filter=${this.filter.join(
        " and "
      )}&$select=${this.query.join(",")}`,
      payload
    ).then((res: any) => {
      return res?.data?.value
    })

    return response
  }

  public static async getDefaultDocumentSerie(document: any) {
    const payload = {
      DocumentTypeParams: document,
    }

    const response = await request(
      "POST",
      `/SeriesService_GetDefaultSeries?$filter=${this.filter.join(
        " and "
      )}&$select=${this.query.join(",")}`,
      payload
    ).then((res: any) => res?.data)

    return response
  }
}
