import request, { url } from "@/utilies/request";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import BPAutoComplete from "@/components/input/BPAutoComplete";
import { Button } from "@mui/material";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import moment from "moment";
import { Breadcrumb } from "../components/Breadcrumn";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useCookies } from "react-cookie";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import DispenserRepository from "@/services/actions/dispenserRepository";

export default function SaleOrderLists() {
  const route = useNavigate();
  const [dataUrl, setDataUrl] = React.useState("");

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Document No.",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "U_tl_pump",
        header: "Pump Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
      },
      {
        accessorKey: "U_tl_cardcode",
        header: "Customer Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
        align: "center",
      },
      {
        accessorKey: "U_tl_cardname",
        header: "Customer Name",
        visible: true,
        type: "string",
        align: "center",
      },

      {
        accessorKey: "U_tl_docdate",
        header: "Posting Date",
        visible: true,
        type: "string",
        align: "center",
        size: 60,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.row.original.U_tl_docdate).format(
            "DD.MMMM.YYYY"
          );
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "U_tl_bplid",
        header: "Branch",
        enableClickToCopy: true,
        visible: true,
        Cell: ({ cell }: any) =>
          new BranchBPLRepository()?.find(cell.getValue())?.BPLName,
      },

      //
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
            <Button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/retail-sale/fuel-cash-sale/` + cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              <span style={{ textTransform: "none" }}>View</span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={cell.row.original.U_tl_status === "Close" ?? false}
              className={`${
                cell.row.original.U_tl_status === "Close" ? "bg-gray-400" : ""
              } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(
                  `/retail-sale/fuel-cash-sale/` +
                    cell.row.original.DocEntry +
                    "/edit",
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />
              <span style={{ textTransform: "none" }}> Edit</span>
            </Button>
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
    queryKey: ["retail-sale-lob", filter !== "" ? "-f" : "", filter],
    queryFn: async () => {
      const apiUrl = `${url}/TL_RETAILSALE/$count?${filter ? `$filter=${filter}` : ""}`;
      const response: any = await request("GET", apiUrl)
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });

      return response;
    },
    // staleTime: Infinity,
  });

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "retail-sale-lob",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],

    queryFn: async () => {
      const Url = `${url}/TL_RETAILSALE?$top=${pagination.pageSize}&$skip=${
        pagination.pageIndex * pagination.pageSize
      }${filter ? ` &$filter= ${filter}` : filter}${
        sortBy !== "" ? "&$orderby=" + sortBy : "&$orderby= DocNum desc"
      }${"&$select =DocNum,DocEntry,U_tl_cardcode,U_tl_cardname,U_tl_bplid,U_tl_pump,U_tl_status,U_tl_docdate"}`;

      const dataUrl = `${url}/TL_RETAILSALE${
        filter
          ? `?$filter=${filter}${sortBy !== "" ? `&$orderby=${sortBy}` : ""}`
          : sortBy !== ""
            ? `?$orderby=${sortBy}`
            : "?$orderby=DocNum%20desc"
      }&$select=DocNum,DocEntry,U_tl_cardcode,U_tl_cardname,U_tl_bplid,U_tl_pump,U_tl_status,U_tl_docdate`;
      setDataUrl(dataUrl);
      const response: any = await request("GET", Url)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
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
  let queryFilters = "";
  const handlerSearch = (value: string) => {
    if (searchValues.docnum) {
      queryFilters += `DocNum eq ${searchValues.docnum}`;
    }
    if (searchValues.cardcode) {
      queryFilters += queryFilters
        ? // : `eq(CardCode, '${searchValues.cardcode}')`;
          ` and U_tl_cardcode eq '${searchValues.cardcode}'`
        : `U_tl_cardcode eq '${searchValues.cardcode}'`;
    }
    if (searchValues.cardname) {
      queryFilters += queryFilters
        ? ` and startswith(U_tl_cardname, '${searchValues.cardname}')`
        : `startswith(U_tl_cardname, '${searchValues.cardname}')`;
    }
    if (searchValues.postingDate) {
      queryFilters += queryFilters
        ? ` and U_tl_docdate eq '${searchValues.postingDate}'`
        : `U_tl_docdate eq '${searchValues.postingDate}'`;
    }
    if (searchValues.status) {
      queryFilters += queryFilters
        ? ` and U_tl_status eq '${searchValues.status}'`
        : `U_tl_status eq '${searchValues.status}'`;
    }
    if (searchValues.bplid) {
      queryFilters += queryFilters
        ? ` and U_tl_bplid eq '${searchValues.bplid}'`
        : `U_tl_bplid eq '${searchValues.bplid}'`;
    }

    let query = queryFilters;

    if (value) {
      query = queryFilters + ` and ${value}`;
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

  const [cookies] = useCookies(["user"]);

  const [searchValues, setSearchValues] = React.useState({
    docnum: "",
    cardcode: "",
    cardname: "",
    postingDate: null,
    status: "",
    bplid: "",
  });

  const childBreadcrum = (
    <>
      <span className="" onClick={() => route(`/retail-sale/fuel-cash-sale`)}>
        <span className=""></span> {"Fuel Cash Sale"}
      </span>
    </>
  );
  const indexedData = useMemo(
    () =>
      data?.map((item: any, index: any) => ({
        ...item,
        index: pagination.pageIndex * pagination.pageSize + index + 1,
      })),
    [data, pagination.pageIndex, pagination.pageSize]
  );
  console.log(dataUrl);
  return (
    <>
      <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
          <Breadcrumb childBreadcrum={childBreadcrum} />
        </div>

        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  type="number"
                  value={searchValues.docnum}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, docnum: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Posting Date"
                  value={searchValues.postingDate}
                  // onChange={(e: any) => handlerChange("PostingDate", e)}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      postingDate: e,
                    });
                  }}
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch
                  </label>
                  <div className="">
                    <BranchAutoComplete
                      BPdata={cookies?.user?.UserBranchAssignment}
                      onChange={(selectedValue) =>
                        setSearchValues({
                          ...searchValues,
                          bplid: selectedValue,
                        })
                      }
                      value={searchValues.bplid}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handlerSearch("")}
                >
                  Go
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataTable
          dataUrl={dataUrl}
          columns={[
            {
              accessorKey: "index",
              header: "No.",
              size: 20,
              visible: true,
              type: "number",
            },
            ...columns,
          ]}
          data={indexedData}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          havePump={true}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title={"Fuel Cash Sale List"}
          createRoute={`/retail-sale/fuel-cash-sale/create`}
        />
      </div>
    </>
  );
}
