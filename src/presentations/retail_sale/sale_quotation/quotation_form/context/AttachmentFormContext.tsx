import request, { url, axiosInstance } from "@/utilies/request";
import { createContext, useEffect, useState } from "react";
import shortid from "shortid";

type GeneralProps = { children: any; Edit?: any };

export const AttachmentContext = createContext({});
export const AttachmentProvider = ({ children, Edit }: GeneralProps) => {
  const [selectedFiles, setSelectedFiles]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const attachment: any = await request(
      "GET",
      `/Attachments2(${Edit?.AttachmentEntry})`
    );

    const files = attachment?.data?.Attachments2_Lines?.map(async (e: any) => {
      const req = await fetchSAPFile(
        `/Attachments2(${Edit?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`
      );
      const blob = await arrayBufferToBlob(
        req.data,
        req.headers["content-type"],
        `${e?.FileName}.${e?.FileExtension}`
      );
      return {
        id: shortid.generate(),
        LineNum: e?.LineNum,
        TargetPath: import.meta.env.VITE_ATTACHMENT_PATH,
        FileName: `${e?.FileName}.${e?.FileExtension}`,
        file: blob,
        freeText: "",
        AttachmentDate: e?.AttachmentDate?.split("T")[0],
      };
    });
    const attFiles = await Promise.all(files);
    setSelectedFiles(attFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (Edit?.AttachmentEntry) getData();
  }, [Edit?.AttachmentEntry]);

  return (
    <AttachmentContext.Provider
      value={{ selectedFiles, setSelectedFiles, loading }}
    >
      {children}
    </AttachmentContext.Provider>
  );
};

const fetchSAPFile = async (uri: any) => {
  const response = await axiosInstance
    .get(url + uri, {
      responseType: "arraybuffer",
    })
    .then((res: any) => res)
    .catch((e: any) => {
      if (window.location.pathname === "/login") {
        throw e?.response?.data?.error?.message?.value;
      }
      if (e?.response?.status === 401) {
        window.location.href = "/login";
        throw e?.response?.data?.error?.message?.value;
      }
      throw e?.response?.data?.error?.message?.value;
    });
  return response;
};

const arrayBufferToBlob = async (arrayBuffer: any, type: any, fileName: any) =>
  new Promise((resolve, reject) => {
    let blob: any = new Blob([arrayBuffer], {
      type: type,
    });

    const dateNum = Date.now();
    const dateStr = new Date();
    const uuid = shortid.generate();

    blob["lastModified "] = dateNum;
    blob["lastModifiedDate "] = dateStr;
    blob["name"] = fileName;
    blob["percent"] = 0;
    blob["uid"] = uuid;

    blob["originFileObj"] = new Blob([arrayBuffer], { type: type });
    blob["originFileObj"]["lastModified"] = dateNum;
    blob["originFileObj"]["lastModifiedDate"] = dateStr;
    blob["originFileObj"]["name"] = fileName;
    blob["originFileObj"]["uid"] = uuid;
    blob["originFileObj"]["webkitRelativePath"] = "";

    resolve(blob);
  });
