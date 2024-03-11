import request, { url } from "@/utilies/request";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Box, Button, CircularProgress, Modal } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import { MRT_RowSelectionState } from "material-react-table";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import shortid from "shortid";
import { LoadingButton } from "@mui/lab";
import FormMessageModal from "@/components/modal/FormMessageModal";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  p: 4,
};
type selectData = {
  U_Type: string;
  U_SourceDocEntry: number;
};
export default function GenerateToModal(props: any) {
  const [openLoading, setOpenLoading] = React.useState(false);
  const [isSubmit, setIsSubmit] = React.useState(false);

  const [transReq, setTransReq] = React.useState([{}]);
  const [total, setTotal] = useState({
    totalShipTo: 0,
    totalQuantity: 0,
  });

  const handleClose = () => {
    props?.setOpen(false);
  };

  useEffect(() => {
    if (props?.document?.length !== 0) {
      let uniqueValues: any = {};
      props?.document.forEach((doc: any) => {
        doc.TL_TR_ROWCollection.forEach((row: any) => {
          const shipToCode = row.U_ShipToCode;
          uniqueValues[shipToCode] = true;
        });
      });
      const totalSum = props?.document.reduce((p: any, c: any) => {
        return (
          p +
          c.TL_TR_ROWCollection.reduce((p: any, c: any) => {
            return p + c?.U_Quantity ?? 0;
          }, 0)
        );
      }, 0);
      setTotal({
        ...total,
        totalShipTo: Object.keys(uniqueValues).length,
        totalQuantity: totalSum,
      });
    }
  }, [props?.document]);
  const handlerSubmit = async () => {
    props?.setOpenLoading(true);
    props?.setOpen(false);
    await request("POST", "/script/test/generate-working-tr", props?.payload)
      .then((res: any) => props?.dialog.current?.success("Create Successfully.", 0))
      .catch((err: any) => props?.dialog.current?.error(err.message))
      .finally(() => {
    props?.setOpenLoading(false);
      });
  };
  return (
    <>
      <Modal
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} borderRadius={3}>
          <div className="h-[80vh] relative flex flex-col">
            <div className="grow">
              <div
                className={`w-full h-full ${
                  openLoading ? "block" : "hidden"
                } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
              >
                <CircularProgress color="success" />{" "}
              </div>
              {/* <div className="w-[80vw] h-[80vh] px-6 py-2 flex flex-col gap-1 relative bg-white"> */}
              <div className="border-b pb-5 mb-[40px] border-zinc-300 text-black font-bold">
                {" "}
                Review - Generate Transportation Orde
              </div>
              <div className="grow grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
                <div className="col-span-12">
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-2 2xl:col-span-3">
                      <MUITextField
                        type="string"
                        label="Total Route"
                        disabled={true}
                      />
                    </div>
                    <div className="col-span-2 2xl:col-span-3">
                      <MUITextField
                        type="string"
                        label="Total Items"
                        value={props?.stockStatus?.length}
                        disabled={true}
                      />
                    </div>
                    <div className="col-span-2 2xl:col-span-3">
                      <MUITextField
                        label="Total Transportation Request"
                        value={props?.document?.length}
                        disabled={true}
                      />
                    </div>

                    <div className="col-span-2 2xl:col-span-3">
                      <MUITextField
                        type="string"
                        label="Total ShipTo"
                        value={total?.totalShipTo}
                        disabled={true}
                      />
                    </div>
                    <div className="col-span-2 2xl:col-span-3">
                      <MUITextField
                        type="string"
                        label="Total Quantity"
                        disabled={true}
                        value={total?.totalQuantity}
                      />
                    </div>

                    <div className="col-span-12 2xl:col-span-12">
                      <span className="text-sm text-gray-500">Items</span>
                      <div className="w-full mt-[0.30rem] grid gap-x-6 grid-cols-6">
                        {props?.stockStatus?.map((e: any, index: number) => (
                          <div
                            key={index}
                            className="text-[0.90rem] border-zinc-300 overflow-hidden rounded-[0.3rem] border"
                          >
                            <div className="p-1 pl-4 border-b border-zinc-300">
                              {e?.ItemCode}
                            </div>
                            <div className="p-1 pl-4 bg-zinc-100">
                              {e?.OrderQuantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span className="mb-3 inline-block mt-[2rem]">
                Transportation Request
              </span>
              <div className="w-full bg-red-300">
                {" "}
                <table className="border table-fixed w-full shadow-sm bg-white border-[#dadde0]">
                  <thead>
                    <tr className="border-[1px] border-[#dadde0] font-semibold text-black bg-zinc-50">
                      <th className="w-[160px] text-left font-normal  py-2 pl-5 text-[14px] ">
                        NO
                      </th>

                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        Document Number
                      </th>
                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        Branch
                      </th>
                      <th className="w-[160px] text-left font-normal  py-2 pl-5 text-[14px] ">
                        Terminal
                      </th>

                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        {" "}
                        Ship To
                      </th>
                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props?.payload?.map((e: any, index: number) => (
                      <tr
                        className="text-sm hover:bg-zinc-50 even:bg-zinc-50 border-b border-zinc-200"
                        key={index}
                      >
                        <td className="pl-5">
                          <span>{index + 1}</span>
                        </td>
                        <td className="pl-5">
                          <span>{e?.DocNum}</span>
                        </td>
                        <td className="pl-5">
                          <span>
                            {props?.branch?.data?.find(
                              (b: any) => b?.BPLID === e?.U_Branch
                            )?.BPLName || <CircularProgress size={"18px"} />}
                          </span>
                        </td>
                        <td className="pl-5">
                          <span>{e?.U_Terminal}</span>
                        </td>
                        <td className="pl-5">
                          <span>{e?.U_ShipAddress}</span>
                        </td>
                        <td className="py-[0.7rem] pl-5">
                          <span>{(e?.CreateDate).split("T")?.at(0)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* </div> */}
            <div className=" bottom-4 mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
                <div className="flex">
                  <LoadingButton
                    size="small"
                    sx={{ height: "25px" }}
                    variant="outlined"
                    style={{
                      background: "white",
                      border: "1px solid red",
                    }}
                    disableElevation
                    onClick={() => props?.setOpen(false)}
                  >
                    <span className="px-3 text-[11px] py-1 text-red-500">
                      Cancel
                    </span>
                  </LoadingButton>
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingButton
                    type="submit"
                    sx={{ height: "25px" }}
                    className="bg-white"
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={handlerSubmit}
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      Add
                    </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
