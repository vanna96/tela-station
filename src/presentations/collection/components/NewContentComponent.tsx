import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Checkbox, IconButton } from "@mui/material";
import { AiOutlineSetting } from "react-icons/ai";
import FormCard from "@/components/card/FormCard";
import { TbSettings } from "react-icons/tb";
import Modal from "@/components/modal/Modal";
import { BiSearch } from "react-icons/bi";
import MUITextField from "@/components/input/MUITextField";
import shortid from "shortid";
import { NumericFormat } from "react-number-format";

interface ContentComponentProps {
  items: any[];
  onChange?: (key: any, value: any) => void;
  columns: any[];
  type?: String;
  labelType?: String;
  typeLists?: any[];
  onRemoveChange?: (record: any[]) => void;
  readOnly?: boolean;
  viewOnly?: boolean;
  data: any;
  loading: boolean;
  isNotAccount: any;
  handlerAddSequence: any;
}

export default function NewContentComponent(props: ContentComponentProps) {
  const columnRef = React.createRef<ContentTableSelectColumn>();
  const [discount, setDiscount] = React.useState(props?.data?.DocDiscount || 0);
  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerRemove = () => {
    if (
      props.onRemoveChange === undefined ||
      Object.keys(rowSelection).length === 0
    )
      return;

    let temps: any[] = [
      ...props.items.filter(({ ItemCode }: any) => ItemCode != ""),
    ];
    Object.keys(rowSelection).forEach((index: any) => {
      const item = props.items[index];
      const indexWhere = temps.findIndex((e) => e?.ItemCode === item?.ItemCode);
      if (indexWhere >= 0) temps.splice(indexWhere, 1);
    });
    setRowSelection({});
    props.onRemoveChange(temps);
  };

  React.useEffect(() => {
    const cols: any = {};
    props.columns.forEach((e: any) => {
      cols[e?.accessorKey] = e?.visible;
    });
    setColVisibility({ ...cols, ...colVisibility });
  }, [props.columns]);

  const columns = useMemo(() => props.columns, [colVisibility]);

  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection };
    rowSelects[index] = true;

    if (!event.target.checked) {
      delete rowSelects[index];
    }

    setRowSelection(rowSelects);
  };

  const handlerAdd = () => {
    const Items = [
      ...props?.items,
      {
        ExpenseCode: "",
        ExpenseName: "",
        Amount: "",
        Remark: "",
      },
    ];
    if (props?.onChange) props.onChange("Items", Items);
  };

  const itemInvoicePrices =
    props?.items?.reduce((prev: number, item: any) => {
      return prev + parseFloat(item?.Amount || 0);
    }, 0) || 0;

  return (
    <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
      <>
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={[
              //   {
              //     accessorKey: "id",
              //     size: 30,
              //     minSize: 30,
              //     maxSize: 30,
              //     enableResizing: false,
              //     Cell: (cell) => (
              //       <Checkbox
              //         checked={cell.row.index in rowSelection}
              //         size="small"
              //         onChange={(event) => onCheckRow(event, cell.row.index)}
              //       />
              //     ),
              //   },
              ...columns,
            ]}
            data={props?.data}
            enableRowNumbers={false}
            enableStickyHeader={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnResizing={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableHiding={true}
            enablePinning={true}
            onColumnVisibilityChange={setColVisibility}
            enableStickyFooter={false}
            enableMultiRowSelection={true}
            initialState={{
              density: "compact",
              columnVisibility: colVisibility,
              rowSelection,
            }}
            state={{
              columnVisibility: colVisibility,
              rowSelection,
              isLoading: props.loading,
              showProgressBars: props.loading,
              showSkeletons: props.loading,
            }}
            muiTableBodyRowProps={() => ({
              sx: { cursor: "pointer" },
            })}
            icons={{
              ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
            }}
            enableTableFooter={false}
          />
        </div>

        <ContentTableSelectColumn
          ref={columnRef}
          columns={props.columns}
          visibles={colVisibility}
          onSave={(value) => {
            setColVisibility(value);
          }}
        />
      </>
    </fieldset>
  );
}

interface ContentTableSelectColumnProps {
  ref?: React.RefObject<ContentTableSelectColumn | undefined>;
  onSave?: (value: any) => void;
  columns: any[];
  visibles: any;
}

class ContentTableSelectColumn extends React.Component<
  ContentTableSelectColumnProps,
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: false,
      searchColumn: "",
      showChecks: false,
      visibles: {},
    } as any;

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handChange = this.handChange.bind(this);
    this.handlerChangeColVisibility =
      this.handlerChangeColVisibility.bind(this);
  }

  componentDidMount(): void {}

  onOpen(data?: any) {
    this.setState({ open: true, visibles: { ...this.props.visibles } });
  }

  onClose() {
    this.setState({ open: false });
  }

  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.state.visibles);
    }

    this.setState({ open: false });
  }

  handChange(event: any) {
    this.setState({ ...this.state, searchColumn: event.target.value });
  }

  handlerChangeColVisibility(event: any, field: string) {
    const visibles = { ...this.state.visibles };
    visibles[field] = event.target.checked;
    this.setState({
      ...this.state,
      visibles: { ...this.props.visibles, ...visibles },
    });
  }

  render() {
    return (
      <Modal
        title={`Columns Setting`}
        titleClass="pt-3 px-2 font-bold w-full"
        open={this.state.open}
        widthClass="w-[40rem]"
        heightClass="h-[80vh]"
        onClose={this.onClose}
        onOk={this.onSave}
        okLabel="Save"
      >
        <div className="w-full h-full flex flex-col ">
          <div className="flex justify-between sticky top-0 bg-white py-2 z-10 border-b">
            <div className="flex">
              <div>
                {" "}
                <Checkbox
                  size="small"
                  className="mt-2"
                  defaultChecked={this.state.showChecks}
                  onChange={(e) =>
                    this.setState({
                      ...this.state,
                      showChecks: !this.state.showChecks,
                    })
                  }
                />
              </div>
              <label htmlFor="showAll" className="flex items-center ">
                Show Selected
              </label>
            </div>
            <div className="flex w-[15rem] items-center">
              <MUITextField
                placeholder="Search Column..."
                onChange={this.handChange}
                endAdornment
                endIcon={<BiSearch className="text-sm" />}
              />
            </div>
          </div>
          <ul className=" text-[14px] grid grid-cols-1 mt-3 ">
            {this.props.columns
              .filter((val) =>
                val.header
                  .toLowerCase()
                  .includes(this.state.searchColumn.toLowerCase())
              )
              .map((e) => (
                <li key={shortid.generate()} className={`border-b`}>
                  <Checkbox
                    checked={this.state.visibles[e?.accessorKey] ?? false}
                    onChange={(event) =>
                      this.handlerChangeColVisibility(event, e?.accessorKey)
                    }
                    size="small"
                  />{" "}
                  <span>{e?.header} </span>
                </li>
              ))}
          </ul>
        </div>
      </Modal>
    );
  }
}
