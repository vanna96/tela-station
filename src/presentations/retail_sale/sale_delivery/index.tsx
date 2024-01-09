import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "./components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import BPAutoComplete from "@/components/input/BPAutoComplete";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ModalAdaptFilter } from "./components/ModalAdaptFilter";
import { BiFilterAlt } from "react-icons/bi";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import moment from "moment";
import MUISelect from "@/components/selectbox/MUISelect";

export default function DeliveryLists() {
  const [open, setOpen] = React.useState<boolean>(false);
  const route = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Doc. No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "CardCode",
        header: "Customer Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
        size: 65,
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        visible: true,
        type: "string",
        align: "center",
        size: 90,
      },
      {
        accessorKey: "TaxDate",
        header: "Posting Date",
        visible: true,
        type: "string",
        align: "center",
        size: 60,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.value).format("YY.MM.DD");
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "DocDueDate",
        header: "Delivery Date",
        visible: true,
        type: "string",
        align: "center",
        size: 60,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.value).format("YY.MM.DD");
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "DocTotal",
        header: " DocumentTotal",
        visible: true,
        type: "string",
        size: 70,
        Cell: ({ cell }: any) => (
          <>
            {" "}
            {"AUD"} {cell.getValue().toFixed(2)}
          </>
        ),
      },
      {
        accessorKey: "DocumentStatus",
        header: " Status",
        visible: true,
        type: "string",
        size: 60,
        Cell: ({ cell }: any) => <>{cell.getValue()?.split("bost_")}</>,
      },
      {
        accessorKey: "DocType",
        header: " Document Type",
        visible: false,
        type: "string",
        align: "center",
        size: 60,
        Cell: ({ cell }: any) => <>{cell.getValue()?.split("dDocument_")}</>,
      },
      {
        accessorKey: "DocEntry",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        enableSorting: false,
        minSize: 100,
        maxSize: 100,
        header: "Action",
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route("/sale/delivery/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                });
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route("/sale/delivery/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                });
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />{" "}
              Edit
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: ["pa-count" + filter !== "" ? "-f" : ""],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/DeliveryNotes/$count?$select=DocNum${filter}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "pa",
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/DeliveryNotes?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }${filter}${sortBy !== "" ? "&$orderby=" + sortBy : ""}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
    retry: 1,
  });

  const handlerRefresh = React.useCallback(() => {
    setFilter("");
    setSortBy("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handlerSearch = (value: string) => {
    let query = "";
    if (value.trim() !== "") {
      // If there is a value in the search, apply the filter
      query = "&$filter=" + value.trim();
    }

    setFilter(query);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  const handlerSearchFilter = (queries: any) => {
    if (queries === "") return handlerSearch("");
    handlerSearch("&$filter=" + queries);
  };


  const handleAdaptFilter = () => {
    setOpen(true);
  };
  const [searchValues, setSearchValues] = React.useState({
    docnum: "",
    cardcode: "",
    cardname: "",
    deliveryDate: "",
    status: "",
  });

  const handleGoClick = () => {
    // Construct the query filters based on search values
    let queryFilters = "";
    if (searchValues.docnum) {
      queryFilters += `DocNum eq ${searchValues.docnum}`;
    }
    if (searchValues.cardcode) {
      queryFilters += queryFilters
        ? ` and startswith(CardCode, '${searchValues.cardcode}')`
        : `startswith(CardCode, '${searchValues.cardcode}')`;
    }
    if (searchValues.cardname) {
      queryFilters += queryFilters
        ? ` and startswith(CardName, '${searchValues.cardname}')`
        : `startswith(CardName, '${searchValues.cardname}')`;
    }
    if (searchValues.deliveryDate) {
      queryFilters += queryFilters
        ? ` and DocDueDate ge '${searchValues.deliveryDate}'`
        : `DocDueDate ge '${searchValues.deliveryDate}'`;
    }
    if (searchValues.status) {
      queryFilters += queryFilters
        ? ` and DocumentStatus eq '${searchValues.status}'`
        : `DocumentStatus eq '${searchValues.status}'`;
    }

    handlerSearchFilter(queryFilters);
  };
  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base mx-2">
            Sale / Delivery
          </h3>
        </div>
        <div className="grid grid-cols-5 gap-3 mb-5 mt-4 mx-2">
          <MUITextField
            label="Document No."
            placeholder="Document No."
            className="bg-white"
            autoComplete="off"
            value={searchValues.docnum}
            onChange={(e) =>
              setSearchValues({ ...searchValues, docnum: e.target.value })
            }
          />

          <BPAutoComplete
            label="Customer"
            value={searchValues.cardcode}
            onChange={(selectedValue) =>
              setSearchValues({ ...searchValues, cardcode: selectedValue })
            }
          />
          <MUITextField
            label="Delivery Date"
            placeholder="Delivery Date"
            className="bg-white"
            type="date"
            value={searchValues.deliveryDate}
            onChange={(e) =>
              setSearchValues({ ...searchValues, deliveryDate: e.target.value })
            }
          />
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Status
            </label>
            <div className="">
              <MUISelect
                items={[
                  { label: "None", value: "" },
                  { label: "Open", value: "bost_Open" },
                  { label: "Close", value: "bost_Close" },
                  // { label: "Paid", value: "bost_Paid" },
                  // { label: "Delivered", value: "bost_Delivered" },
                ]}
                onChange={(e) =>
                  setSearchValues({ ...searchValues, status: e.target.value })
                }
                value={searchValues.status}
              />
            </div>
          </div>

          <div className="flex justify-end items-center align-center space-x-4 mt-4">
            <Button variant="contained" size="small" onClick={handleGoClick}>
              Go
            </Button>

            <div>
              <DataTableColumnFilter
                handlerClearFilter={handlerRefresh}
                title={
                  <div className="flex gap-2">
                    {/* <span className="text-lg">
                      <BiFilterAlt />
                    </span>{" "} */}
                    {/* <span className="text-[13px] capitalize">Adapt Filter</span> */}
                    <Button
                      variant="outlined"
                      size="small"
                      // onClick={handleGoClick}
                    >
                      Adapt Filter
                    </Button>
                  </div>
                }
                items={columns?.filter((e) => e?.accessorKey !== "DocEntry")}
                onClick={handlerSearch}
              />
            </div>
          </div>
        </div>
        <div>
          <DataTable
            columns={columns}
            data={data}
            handlerRefresh={handlerRefresh}
            handlerSearch={handlerSearch}
            handlerSortby={handlerSortby}
            count={Count?.data || 0}
            loading={isLoading || isFetching}
            pagination={pagination}
            paginationChange={setPagination}
            title="Delivery Lists"
          />
        </div>
      </div>
    </>
  );
}
