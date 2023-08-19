import React, { useCallback, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Checkbox, TextField } from "@mui/material";
import MUITextField from "../../../../components/input/MUITextField";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import FormCard from "@/components/card/FormCard";
import ContactPersonModal from "./ContactPersonModal";
import EmailGroupSelect from "@/components/selectbox/EmailGroup";
import shortid from "shortid";

export interface ContactPersonProps {
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: string) => void;
  handlerChange: (key: string, value: any) => void;
  handlerUpdate: (value: any) => void;
  open: boolean;
  onClose: () => void;
  onOk: (person: any) => void;
  data: any;
  handlerOpenContactPerson: () => void;
}

export default function ContactPerson(props: ContactPersonProps) {
  const [tableKey, setTableKey] = React.useState(Date.now());
  const [handlerOpenContactperson, setHandlerOpenContactperson] =
    React.useState<boolean>(false);
  // const [row, setRow] = React.useState<any>({});

  const {
    onOk,
    onClose,
    // open,
    data,
    handlerChangeItem,
    handlerRemoveItem,
    handlerOpenContactPerson,
    handlerUpdate,
  } = props;
  const handlerChangeInput = (event: any, row: any, field: any) => {
    handlerChangeItem({ value: event.target.value, record: row, field });
  };
  const handlerRemoveRow = (row: any) => {
    handlerRemoveItem(row.CardCode);
  };
  const [items, setItems] = useState<any>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [itemRow, setItemRow] = useState<any>({});
  const updateRow = (cell: any) => {
    setOpenEditModal(true);
    const dd = cell.row.original;
    setItemRow(dd);
    console.log(dd);
    console.log(itemRow);
  };
  console.log(itemRow);

  function setItemState(data: any) {
    let temp = data.map((e: any) => e);
    setItems(temp);
  }

  function updateItem(value: any) {
    console.log(value);
    handlerUpdate(value);
    setOpenEditModal(false);
  }

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 60,
        enableResizing: false,
        Cell: ({ cell }: any) => {
          // return ;
          return (
            <Button
              size="small"
              color="error"
              onClick={() => handlerRemoveRow(cell.row.original)}
            >
              <AiOutlineDelete />
            </Button>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Contact ID", //uses the default width from defaultColumn prop
        Cell: ({cell}: any) => {
          return (
            <MUITextField
              endAdornment
              onClick={() => updateRow(cell)}
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "name")
              }
            />
          );
        },
      },

      {
        accessorKey: "firstName",
        header: "First Name",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "firstName")
              }
            />
          );
        },
      },
      {
        accessorKey: "middleName",
        header: "Middle Name",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "middleName")
              }
            />
          );
        },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "lastName")
              }
            />
          );
        },
      },
      {
        accessorKey: "title",
        header: "title",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "title")
              }
            />
          );
        },
      },
      {
        accessorKey: "position",
        header: "Position",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "position")
              }
            />
          );
        },
      },
      {
        accessorKey: "address",
        header: "Address",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell?.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "address")
              }
            />
          );
        },
      },
      {
        accessorKey: "phone1",
        header: "TelePhone 1",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "phone1")
              }
            />
          );
        },
      },
      {
        accessorKey: "phone2",
        header: "Telephone 2",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "phone2")
              }
            />
          );
        },
      },
      {
        accessorKey: "mobilePhone",
        header: "Mobile Phone",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "mobilePhone")
              }
            />
          );
        },
      },
      {
        accessorKey: "fax",
        header: "Fax",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "fax")
              }
            />
          );
        },
      },
      {
        accessorKey: "e_Mail",
        header: "E-Mail",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "e_Mail")
              }
            />
          );
        },
      },
      {
        accessorKey: "emailGroupCode",
        header: "Email-Group",
        Cell: ({ cell }: any) => {
          return (
            <EmailGroupSelect
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "emailGroupCode")
              }
            />
          );
        },
      },
      {
        accessorKey: "pager",
        header: "Pager",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "pager")
              }
            />
          );
        },
      },
      {
        accessorKey: "remarks1",
        header: "Remark 1",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "remark1")
              }
            />
          );
        },
      },
      {
        accessorKey: "remarks2",
        header: "Remark 2",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "remark2")
              }
            />
          );
        },
      },
      {
        accessorKey: "password",
        header: "Password",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "remark1")
              }
            />
          );
        },
      },
      {
        accessorKey: "placeOfBirth",
        header: "Country/Region Of Birth",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "placeOfBirth")
              }
            />
          );
        },
      },
      {
        accessorKey: "dateOfBirth",
        header: "DateOfBirth",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "remark1")
              }
            />
          );
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "remark1")
              }
            />
          );
        },
      },
      {
        accessorKey: "profession",
        header: "Profession",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "profession")
              }
            />
          );
        },
      },
      {
        accessorKey: "cityOfBirth",
        header: "CityOfBirth",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "cityOfBirth")
              }
            />
          );
        },
      },
      {
        accessorKey: "connectedAddressName",
        header: "Connected Address",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(
                  event,
                  cell?.row?.original,
                  "connectedAddressName"
                )
              }
            />
          );
        },
      },
    ],
    [data.contactEmployees]
  );

  console.log(data.contactEmployees);

  return (
    <FormCard title="Contact Person">
      <div className="col-span-2 data-table">
        <div className="flex flex-col-reverse">
          <MaterialReactTable
            key={tableKey}
            columns={itemColumns}
            data={data.contactEmployees ?? []}
            enableStickyHeader={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableBottomToolbar={false}
            enableTopToolbar={true}
            enableColumnResizing={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableHiding={true}
            icons={{
              ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
            }}
            renderTopToolbarCustomActions={({ table }) => {
              return (
                <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
                  <Button variant="outlined" size="small">
                    <span
                      className="text-xs  capitalize font-normal"
                      onClick={handlerOpenContactPerson}
                    >
                      + Define New
                    </span>
                  </Button>
                </div>
              );
            }}
          />

          <ContactPersonModal
            open={openEditModal}
            data={itemRow}
            onClose={() => {
              setOpenEditModal(false);
              setItemRow(null);
            }}
            onOk={updateItem}
          />
        </div>
      </div>
    </FormCard>
  );
}
