import { Button, Modal } from "@mui/material";
import { useContext, useState } from "react";
import Loading from "../../../../../assets/img/loading.gif";
import { ContactContext } from "../context/ContentFormContext";
import { ContentItemDataTable } from "./ContentItemDataTable";
import { type MRT_RowSelectionState } from "material-react-table";
import { ContentServiceDataTable } from "./ContentServiceDataTable";

type ModalContentServiceProps = {
  contentType?: string;
  openModal: boolean;
  handleClose: any;
  data?: any;
  editData?: any;
};

export const ModalContentService = ({
  openModal,
  handleClose,
  contentType,
  data,
  editData,
}: ModalContentServiceProps) => {
  let newData = data;
  const [nameField, setName] = useState("");
  const { formContent, setFormContent }: any = useContext(ContactContext);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

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

    const dataSelected = data
      .filter((res: any, index: number) => rows.includes(index.toString()))
      .map((res: any) => {
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
      const editRow = formContent?.items?.filter(
        (ch: any) => ch.ItemCode !== editData.ItemCode
      );
      setFormContent({ ...formContent, items: [...dataSelected, ...editRow] });
      handleClose();
      return;
    }

    if (formContent?.items)
      setFormContent({
        ...formContent,
        items: [...formContent.items, ...dataSelected],
      });
    else setFormContent({ ...formContent, items: dataSelected });
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
        <p className="font-semi-bold text-2xl mb-4">{contentType}</p>
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
          {data === undefined ? (
            <img src={Loading} className="w-28 mx-auto" />
          ) : (
            <ContentServiceDataTable
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
