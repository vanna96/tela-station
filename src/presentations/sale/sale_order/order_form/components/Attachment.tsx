import { Box, Modal } from "@mui/material";
import { useContext, useState } from "react";
import { FormOrderContext } from "../context/FormOrderContext";
import { DragDropFile } from "./DragDropMenu";
import CircularProgress from "@mui/material/CircularProgress";
import request, { axiosInstance, url } from "@/utilies/request";
import shortid from "shortid";
import { useQuery } from "react-query";

export default function Attachments() {
  const { form, setForm, Edit }: any = useContext(FormOrderContext);
  const [image, setImage] = useState("");
  const [openModal, setOpen] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  const { data: Attachment } = useQuery({
    queryKey: ["attachment"],
    queryFn: async () => {
      setAttachmentLoading(true);
      const res = await request(
        "GET",
        `/Attachments2(${Edit?.AttachmentEntry})`
      )
        .then((res: any) => res?.data?.Attachments2_Lines)
        .catch((error) => console.log(error));

      const files = res?.map(async (e: any) => {
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
      setForm({ ...form, documentLines: attFiles });
      setAttachmentLoading(false);
    },
    cacheTime: 0,
    staleTime: 0,
    enabled: Edit?.AttachmentEntry ? true : false,
  });

  const handleDelete = (index: any) => {
    const availableFiles = form?.documentLines.filter(
      (e: any, i: number) => i !== index
    );
    setForm({ ...form, documentLines: availableFiles });
  };

  const handleShowImage = async (index: number) => {
    const row = form?.documentLines.find((e: any, i: number) => i === index);
    const img: any = await fileToBase64(
      row?.file ? row?.file?.originFileObj : row
    );
    setImage(img);
    setOpen(true);
  };

  return (
    <>
      <div className="mt-4">
        <Modal
          open={openModal}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <img src={image}></img>
          </Box>
        </Modal>
        <DragDropFile />
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 w-1">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Target Path
                </th>
                <th scope="col" className="px-6 py-3">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Attachment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {form?.documentLines.length > 0 ? (
                form?.documentLines.map((e: any, index: number) => {
                  const today = Date.now();
                  const date = new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(today);

                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={index}
                    >
                      <td className="px-6 py-3 flex space-x-3 items-center">
                        <div className="border-gray-300 border-[1px] p-1 rounded-sm cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 text-red-500"
                            onClick={() => handleDelete(index)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                        <div className="border-gray-300 border-[1px] p-1 rounded-sm cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 text-gray-500"
                            onClick={() => handleShowImage(index)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-2">
                        {import.meta.env.VITE_ATTACHMENT_PATH}
                      </td>
                      <td className="px-2">{e.name || e?.FileName}</td>
                      <td className="px-2">{date}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="text-center mt-5">
                      {Edit?.AttachmentEntry && attachmentLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-center text-blue-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                              />
                            </svg>
                          </div>
                          <p>No Data</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const fileToBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

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
