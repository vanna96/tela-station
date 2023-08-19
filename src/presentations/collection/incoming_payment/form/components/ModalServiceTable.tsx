import { Button, Modal } from "@mui/material";
import { useContext, useState } from "react";
import Loading from "../../../../../assets/img/loading.gif";
import { type MRT_RowSelectionState } from "material-react-table";
import { FormOrderContext } from "../context/FormOrderContext";
import { ServiceDataTable } from "./ServiceDataTable";

type ModalServiceTableProps = {
  openModal: boolean;
  handleClose: any;
  editData?: any;
};

export const ModalServiceTable = ({
  openModal,
  handleClose,
  editData,
}: ModalServiceTableProps) => {
  const [nameField, setName] = useState("");
  const { form, setForm, ContentService }: any = useContext(FormOrderContext);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  let newData = ContentService;

  if (nameField)
    newData = newData.filter(
      (e: any) =>
        new RegExp(nameField, "i").test(e.Code) ||
        new RegExp(nameField, "i").test(e.Name)
    );

  const handleSelectChoose = () => {
    if (!rowSelection) return;

    const rows: any = Object.keys(rowSelection).filter((key, index) => {
      if (!rowSelection[key]) return;
      return key;
    });

    const dataSelected = ContentService.filter((res: any, index: number) =>
      rows.includes(index.toString())
    ).map((res: any) => {
      return {
        ...res,
        taxCode: "",
        total: "",
        blanketAgreement: "",
        description: "",
      };
    });

    // on edit item row
    if (editData) {
      const editRow = form?.items?.filter(
        (ch: any) => ch.ItemCode !== editData.ItemCode
      );
      setForm({ ...form, items: [...dataSelected, ...editRow] });
      handleClose();
      return;
    }

    if (form?.items)
      setForm({
        ...form,
        items: [...form.items, ...dataSelected],
      });
    else setForm({ ...form, items: dataSelected });
    handleClose();
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="bg-white rounded-md mt-[10%] w-[50%] max-h-[70%] overflow-y-scroll m-auto border-white border-2 p-4">
        <p className="font-semi-bold text-2xl mb-4">{form?.itemServiceType}</p>
        <div className="grid grid-cols-1 lg:block mb-5 p-2 pb-4 border-[1px] border-gray-200">
          <div className="flex md:block items-center px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Find
            </label>
            <input
              name=""
              type="text"
              className="form-control h-[25px] w-[100%] lg:w-[100%]"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          {ContentService === undefined ? (
            <img src={Loading} className="w-28 mx-auto" />
          ) : (
            <ServiceDataTable
              editData={editData}
              data={newData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
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
  );
};
