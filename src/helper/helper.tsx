import Encryption from "@/utilies/encryption"
import moment from "moment"
import request, { axiosInstance, url } from "@/utilies/request"

export const numberWithCommas = (value: any) => {
  value = value.toString()
  var pattern = /(-?\d+)(\d{3})/
  while (pattern.test(value)) value = value.replace(pattern, "$1,$2")
  return value
}

export const formatDate = (date: any, jv = "-") => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return [year, month, day].join(jv)
}

export const diffDays = (startDate: any, endDate?: any) => {
  const dt1 = new Date(startDate)
  const dt2 = new Date(endDate || formatDate(new Date()) + "T00:00:00Z")
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  )
}

export const getLocalCacheData = ({
  key,
  async = true,
}: {
  key: string
  async?: boolean
}) => {
  const data = localStorage.getItem(key)
  if (!data) return data
  const json = JSON.parse(Encryption.decrypt(key, data))
  if (async) return Promise.all(JSON.parse(json))
  return JSON.parse(json)
}

export const getAttachment = async (files: any) => {
  let data = new FormData()
  files.map((file: any, index: number) => {
    const fileName = file.Filename || file.name
    const blobFile = file?.file || null
    if (blobFile) {
      file = new File([blobFile], fileName, {
        type: blobFile.type,
        lastModified: blobFile.lastModifiedDate,
      })
    }
    data.append(`uploads[${index}]`, file, Date.now() + fileName)
  })

  const res: any = await request("POST", "/Attachments2", data)
  return res?.data?.AbsoluteEntry
}

export const fetchSAPFile = async (uri: any) => {
  const response = await axiosInstance
    .get(url + uri, {
      responseType: "arraybuffer",
    })
    .then((res: any) => res)
    .catch((e: any) => {
      if (window.location.pathname === "/login") {
        throw e?.response?.data?.error?.message?.value
      }
      if (e?.response?.status === 401) {
        window.location.href = "/login"
        throw e?.response?.data?.error?.message?.value
      }
      throw e?.response?.data?.error?.message?.value
    })
  return response
}
