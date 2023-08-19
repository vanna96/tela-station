import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { CustomerDataTable } from "./CustomerDataTable";
import Loading from "../../../../../assets/img/Loading.gif";

type ModalBusinessPartnerProps = {
  openModal: boolean;
  handleClose?: any;
  customers?: any;
  setCustomer?: any;
};

export const ModalBusinessPartner = ({
  openModal,
  handleClose,
  customers,
  setCustomer,
}: ModalBusinessPartnerProps) => {
  let data = customers?.value;

  const [search, setSearch] = useState("");
  const [choose, setChoose]: any = useState();

  if (search)
    data = data.filter(
      (code: any) =>
        new RegExp(search, "i").test(code.CardCode) ||
        new RegExp(search, "i").test(code.CardName)
    );

  const handleSelectChoose = () => {
    if (!choose) return;
    setCustomer(choose.original.CardCode);
    handleClose();
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white rounded-md mt-[10%] w-[50%] max-h-[70%] overflow-y-scroll m-auto border-white border-2 p-4">
          <p className="font-semi-bold text-2xl mb-4">Business Partner</p>
          <div className="mb-5 p-2 pb-4 border-[1px] border-gray-200">
            <div className="flex md:block items-center px-3 mt-3">
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
                Find
              </label>
              <input
                name=""
                type="text"
                className="form-control h-[25px] w-[60%] lg:w-[100%]"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            {data === undefined ? (
              <img src={Loading} className="w-28 mx-auto" />
            ) : (
              <CustomerDataTable data={data} setChoose={setChoose} />
            )}
          </div>
          <div className="space-x-3">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleSelectChoose}
            >
              Choose
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
