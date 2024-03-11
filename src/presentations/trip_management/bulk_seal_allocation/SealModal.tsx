import request, { url } from "@/utilies/request";
import React, { useEffect, useState } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { log } from "console";
import { useQuery } from "react-query";
import itemRepository from "@/services/actions/itemRepostory";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SelectPage from "../bulk_seal_allocation/SelectPage";
import { useForm } from "react-hook-form";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35rem",
  bgcolor: "background.paper",
  p: 4,
};

export default function SealModal(props: any) {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, defaultValues },
  } = useForm();
  const [openLoading, setOpenLoading] = React.useState(false);

  const onSubmit = async (e: any) => {

    setOpenLoading(true);
    const data = {
      ...e,
      End_Seal_Number: `${getValues("Start_Seal_Number")}${getValues("Total_Seal_Number")}`,
    };
    let lastChar = parseInt(data?.End_Seal_Number?.slice(-1));

    //get seal
    let result: any[] = [];
    for (let i = 0; i < lastChar; i++) {
      result.push(data?.End_Seal_Number.slice(0, -1) + (lastChar - i));
    }

    //complete data
    let loadData: any = [];
    for (const [index, item] of props?.data?.entries()) {
      let emp = { ...item };
      emp["TL_TO_COMPARTMENTCollection"] = emp["TL_TO_COMPARTMENTCollection"]
        ?.filter((e: any) => e?.U_SealReference === null)
        ?.map((e: any) => ({
          ...e,
          U_SealReference: result[index],
        }));  
      loadData.push(emp);
    }
    console.log(loadData);
    
    // await request("POST", `/script/test/get-tr-documents`, data)
    //   .then((res: any) => {
    //     setOpenLoading(false);
    //   })
    //   .catch((e: any) => {
    //     setOpenLoading(false);
    //   });
  };

  const handleClose = () => {
    props?.setOpen(false);
  };
  useEffect(() => {
    setValue("Total_Seal_Number", props?.data?.length);
  }, [props?.open]);

  return (
    <>
      <Modal
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} borderRadius={3}>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="h-[29rem] overflow-hidden relative flex flex-col">
              <div className="grow">
                {/* <div className="w-[80vw] h-[80vh] px-6 py-2 flex flex-col gap-1 relative bg-white"> */}
                <div className="mb-[20px] text-md border-zinc-300 text-black font-bold">
                  {" "}
                  Seals Auto Allocation
                </div>
                <span className="text-[0.9rem] mb-[30px] inline-block text-gray-600">
                  Auto allocation number to each trip seal compartments.
                </span>
                <div className="mt-5">
                  <label
                    htmlFor=""
                    className="text-gray-600 text-[14px] mb-1 inline-block"
                  >
                    Start Seal Number{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <MUITextField
                    inputProps={{
                      ...register("Start_Seal_Number", {}),
                    }}
                  />
                </div>
                <div className="mt-5">
                  <label
                    htmlFor=""
                    className="text-gray-600 text-[14px] mb-1 inline-block"
                  >
                    Total Seal Number{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <MUITextField
                    value={props?.data?.length}
                    inputProps={{
                      ...register("Total_Seal_Number", {}),
                    }}
                  />
                </div>
                <div className="mt-5">
                  <label
                    htmlFor=""
                    className="text-gray-600 text-[14px] mb-1 inline-block"
                  >
                    End Seal Number <span className="text-red-500 ml-1">*</span>
                  </label>
                  <MUITextField
                    type="string"
                    value={`${watch("Start_Seal_Number") ?? ""}${watch("Total_Seal_Number") ?? ""}`}
                  />
                </div>
              </div>
              <div className="sticky bottom-1">
                <div className=" bg-white p-2 rounded shadow-sm z-[1000] flex justify-end gap-3 border">
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
                      onClick={() => handleClose()}
                    >
                      <span className="px-3 text-[11px] py-1 text-red-500">
                        Close
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
                    >
                      <span className="px-6 text-[11px] py-4 text-white">
                        Post
                      </span>
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
