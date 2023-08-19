import FormCard from '@/components/card/FormCard';
import MUITextField from '@/components/input/MUITextField';
import CitySelect from '@/components/selectbox/City';
import CountrySelect from '@/components/selectbox/Country';
import { Button, Checkbox, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import MaterialReactTable from "material-react-table";
import { AiOutlineDelete } from 'react-icons/ai';
import shortid from 'shortid';

export interface ICompartementFormProps {
  data: any,
  edit: boolean,
  handlerChangeItem: (record: any) => void;
}


export default function Compartement({ data, edit, handlerChangeItem }: ICompartementFormProps) {
  const [compartement, setCompartement] = useState<any>({ ...data })


  const handlerChangeInput = (event: any, row: any, field: any) => {
    handlerChangeItem({ value: event.target.value, record: row, field })
  }
  const add = () => {
    const newItem = {
      id: shortid.generate(),
      u_VEHCOMPNO: null,
      u_VEHCOMPVO: null,
      u_VEHCOMPHA: null
    };

    // Create a new array with the existing items and the new item
    const newItems = [...compartement.items, newItem];

    // Create a new object with the updated items array
    const updatedCompartement = {
      // ...compartement,
      items: newItems
    };

    // Update the state with the new compartement object
    setCompartement(updatedCompartement);

    console.log(updatedCompartement);
  };
  const handleDeleteItem = (itemId: string) => {

    setCompartement((prevState: any) => {
      // Find the index of the item to be deleted

      const itemIndex = prevState.items.findIndex((item: any) => item.id === itemId);

      if (itemIndex === -1 || prevState.items.length === 1) {
        // If the item is not found, return the current state
        return prevState;
      }

      // Create a new state object with the item removed
      const newState = {
        ...prevState,
        items: [
          ...prevState.items.slice(0, itemIndex),
          ...prevState.items.slice(itemIndex + 1)
        ]
      };

      return newState;
    });
  };
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 40,
        enableResizing: false,
        Cell: (cell: any) => {
          return (
            <div role="button" className="flex justify-center items-center">
              <button
                type="button"
                className="border border-gray-200 p-1 rounded-sm"
                onClick={() => handleDeleteItem(cell?.row?.original?.id)}
              >
                <AiOutlineDelete />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "u_VEHCOMPNO",
        header: "Number", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          // return ;
          return <MUITextField
            defaultValue={cell.getValue()}
            name="U_VEHCOMPNO"
            type='number'
            onBlur={(event) => handlerChangeInput(event, cell?.row?.original, 'u_VEHCOMPNO')}
          />;
        },
      },
      {
        accessorKey: "u_VEHCOMPVO",
        header: "Volumn",
        Cell: ({ cell }: any) => {

          return <MUITextField
            defaultValue={cell.getValue()}
            name="U_VEHCOMPVO"
            type='number'

            onBlur={(event) => handlerChangeInput(event, cell?.row?.original, 'u_VEHCOMPVO')}
          />;
        },
      },
      {
        accessorKey: "u_VEHCOMPHA",
        header: "	No. of Hatch",
        Cell: ({ cell }: any) => {

          return <MUITextField
            defaultValue={cell.getValue()}
            name="U_VEHCOMPHA"
            type='number'
            onBlur={(event) => handlerChangeInput(event, cell?.row?.original, 'u_VEHCOMPHA')}
          />;
        },
      },

    ],
    []
  );


  console.log(compartement);


  return (
    <FormCard title='Compartement'>
      <div className="col-span-2 data-table">
        <MaterialReactTable
          columns={columns}
          data={compartement.items ?? []}
          enableHiding={true}
          initialState={{ density: "compact" }}
          enableDensityToggle={false}
          enableColumnResizing
          enableStickyHeader={true}
          enableStickyFooter={true}
          enablePagination={true}
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 10, 15],
          }}
          onPaginationChange={setPagination}
          state={{
            pagination,
          }}
          renderTopToolbarCustomActions={({ table }) => {
            return <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
              {!data?.isApproved ?
                <>
                  <Button variant="outlined" size="small"
                    onClick={add}
                  ><span className="text-xs  capitalize font-normal">+ Add New</span></Button>
                </>
                : null}

            </div>
          }}
        />
      </div>
    </FormCard>
  )
}