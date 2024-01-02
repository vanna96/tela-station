import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "./components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import { ModalAdaptFilter } from "./components/ModalAdaptFilter";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import { useCookies } from "react-cookie";
import { APIContext } from "../context/APIContext";

export default function Lists() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { branchBPL }: any = React.useContext(APIContext);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    docnum: 0,
    code: "",
    name: "",
    docdate: null,
  });
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Code",
        header: " Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        // type: "number",
      },
      {
        accessorKey: "Name",
        header: "Name", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
      },

      {
        accessorKey: "U_tl_date",
        header: " Date", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        Cell: (cell: any) => {
          if (!cell.row.original?.U_tl_date) return;
          return cell.row.original?.U_tl_date.toString().replace(
            "T00:00:00Z",
            ""
          );
        },
      },

      {
        accessorKey: "U_tl_remark",
        header: "Remark", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
      },
      {
        accessorKey: "U_tl_status",
        header: "Status",
        size: 40,
        visible: true,
        // Cell: ({ cell }: any) => (cell.getValue() === "Y" ? "Yes" : "No"),
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
                route(
                  "/sale-target/sale-target/" + cell.row.original.Code,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/sale-target/sale-target/${cell.row.original.Code}/edit`,
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
    queryKey: [`TL_SALES_TARGET`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_SALES_TARGET/$count?${filter}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "TL_SALES_TARGET",
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_SALES_TARGET?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&${filter}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
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
    setFilter(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  const handleAdaptFilter = () => {
    setOpen(true);
  };

  const handleGoClick = () => {
    let queryFilters: any = [];
    if (searchValues.docnum)
      queryFilters.push(`startswith(DocNum, '${searchValues.docnum}')`);
    if (searchValues.code)
      queryFilters.push(`startswith(Code, '${searchValues.code}')`);
    if (searchValues.name)
      queryFilters.push(`startswith(Name, '${searchValues.name}')`);
    if (searchValues.docdate)
      queryFilters.push(
        `startswith(CreateDate, '${searchValues.docdate}T00:00:00Z')`
      );

    if (queryFilters.length > 0)
      return handlerSearch(`$filter=${queryFilters.join(" and ")}`);
    return handlerSearch("");
  };

  return (
    <>
      <ModalAdaptFilter
        isOpen={open}
        handleClose={() => setOpen(false)}
      ></ModalAdaptFilter>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Sale Target
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  type="number"
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.docnum}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, docnum: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label=" Code"
                  placeholder="Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.code}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, code: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Name"
                  placeholder="Name"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.name}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, name: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label=" Date"
                  value={searchValues?.docdate}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      docdate: e || null,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGoClick}
                >
                  Go
                </Button>
              </div>
              <div className="">
                <DataTableColumnFilter
                  handlerClearFilter={handlerRefresh}
                  title={
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        // onClick={handleGoClick}
                      >
                        Adapt Filter
                      </Button>
                    </div>
                  }
                  items={columns?.filter(
                    (e) =>
                      e?.accessorKey !== "DocEntry" &&
                      e?.accessorKey !== "DocNum" &&
                      e?.accessorKey !== "CardCode" &&
                      e?.accessorKey !== "CardName" &&
                      e?.accessorKey !== "DocDueDate" &&
                      e?.accessorKey !== "DocumentStatus"
                  )}
                  onClick={handlerSearch}
                />
              </div>
            </div>
          </div>
        </div>
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
          title="Sale Target"
        />
      </div>
    </>
  );
}
