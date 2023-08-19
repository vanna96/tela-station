import { Button, Modal } from "@mui/material";
import { useContext, useState } from "react";
import Loading from "../../../../../assets/img/loading.gif";
import { type MRT_RowSelectionState } from "material-react-table";
import { ItemDataTable } from "./ItemDataTable";
import { FormOrderContext } from "../context/FormOrderContext";

type ModalItemTableProps = {
  openModal: boolean;
  handleClose: any;
  editData?: any;
};

export const ModalItemTable = ({
  openModal,
  handleClose,
  editData,
}: ModalItemTableProps) => {
  const {
    form,
    setForm,
    bussinessPartner,
    TaxCode,
    UnitOfMeasurementGroups,
    Item,
  }: any = useContext(FormOrderContext);

  let newData = Item;
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  if (search)
    newData = newData.filter(
      (code: any) =>
        new RegExp(search, "i").test(code.ItemCode) ||
        new RegExp(search, "i").test(code.ItemName)
    );

  const handleSelectChoose = () => {
    if (!rowSelection || !bussinessPartner?.PriceListNum) return;

    const rows: any = Object.keys(rowSelection).filter((key, index) => {
      if (!rowSelection[key]) return;
      return key;
    });

    const dataSelected = Item.filter((res: any, index: number) =>
      rows.includes(index.toString())
    ).map((res: any) => {
      const uom =
        UnitOfMeasurementGroups?.find(
          (e: any) => e.AbsEntry === res.UoMGroupEntry
        )?.Code || "Manual";
      const price =
        res.ItemPrices?.find(
          (price: any) => price.PriceList === bussinessPartner?.PriceListNum
        )?.Price || 0;

      const discount =
        bussinessPartner?.DiscountGroups?.find(
          (e: any) => e.ObjectEntry.toString() === res.ItemsGroupCode.toString()
        )?.DiscountPercentage || 0;

      // total
      let total = 1 * price;
      if (discount > 0) {
        total = total - (total * discount) / 100;
      }

      // tax code
      const rate =
        TaxCode?.find((e: any) => e.Code === res?.SalesVATGroup)
          ?.VatGroups_Lines[0]["Rate"] || 10;

      return {
        ...res,
        qty: 1,
        discount: discount,
        unitPrice: price,
        taxCode: res?.SalesVATGroup || "S1",
        rate: (rate / 100) * total,
        total: total,
        uomCode: uom,
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
          {Item === undefined ? (
            <img src={Loading} className="w-28 mx-auto" />
          ) : (
            <ItemDataTable
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
