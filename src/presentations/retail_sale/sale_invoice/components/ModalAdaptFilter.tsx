import React from "react"
import Modal from "@/components/modal/Modal"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { FaTimes } from "react-icons/fa"
import MUITextField from "@/components/input/MUITextField"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { Button, Divider } from "@mui/material"
import { AiOutlinePlus } from "react-icons/ai"
import { BiSearch } from "react-icons/bi"

export const ModalAdaptFilter = ({
  isOpen = false,
  handleClose,
}: {
  isOpen?: boolean
  handleClose: () => void
}) => {
  const [rows, setRows] = React.useState<[any]>([
    {
      field: "",
      conditionType: "",
      value: "",
    },
  ])

  const handleChange = (props: { field: string; value: string; index: number }) => {
    const { field, value, index } = props
    const newData: any = rows.map((row: any, i: number) => {
      if (i === index) row[field] = value
      return row
    })
    setRows(newData)
  }

  const handleAddFilter = () => {
    const newValues: any = rows.concat({ conditionType: "", field: "", value: "" })
    setRows(newValues)
  }

  const handleRemoveRow = (index: number) => {
    const update: any = rows.filter((_: any, i: number) => i !== index)
    setRows(update)
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Adapt Filter"
      widthClass="w-[60vw] sm:w-[90vw] relative"
      heightClass="h-[70vh]"
      disableFooter={true}
    >
      <>
        <FormTable
          rows={rows}
          handleChange={handleChange}
          handleRemoveRow={handleRemoveRow}
        />
        <div className="my-4">
          <Button
            size="small"
            variant="text"
            style={{
              background: "#1565c0",
              color: "white",
            }}
            onClick={handleAddFilter}
          >
            <span className="text-lg mr-2">
              <AiOutlinePlus />
            </span>
            <span className="capitalize text-sm">Add Filter</span>
          </Button>
        </div>
        <div className="space-x-2 text-right absolute bottom-4 right-10">
          <Button
            size="small"
            variant="text"
            style={{
              background: "white",
              color: "black",
              border: "1px solid #80808030",
            }}
            onClick={handleClose}
          >
            <span className="capitalize text-sm">Cancel</span>
          </Button>
          <Button
            size="small"
            variant="text"
            style={{
              background: "#1565c0",
              color: "white",
            }}
            onClick={handleAddFilter}
          >
            <span className="text-lg mr-2">
              <BiSearch />
            </span>
            <span className="capitalize text-sm" onClick={handleClose}>
              Search
            </span>
          </Button>
        </div>
      </>
    </Modal>
  )
}

const FormTable: React.FC<any> = ({ rows, handleChange, handleRemoveRow }: any) => {
  const ConditionTypes: any = React.useMemo(() => {
    return [
      {
        value: "eq",
        name: "Equal to",
      },
      {
        value: "ne",
        name: "Not equal to",
      },
      {
        value: "contains",
        name: "Contains",
      },
      {
        value: "startWith",
        name: "Stats with",
      },
      {
        value: "endsWith",
        name: "Ends with",
      },
    ]
  }, [])

  const fields: any = React.useMemo(() => {
    return [
      {
        value: "Journal Remarks",
        name: "Journal Remarks",
      },
    ]
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, border: "1px solid #80808030" }}>
        <TableHead>
          <TableRow className="bg-gray-300 text-white">
            {["Field", "Condition Type", "Value"].map((field, index: number) => (
              <TableCell align="left" key={index}>
                <b>{field}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div className="flex items-center space-x-4">
                  <FaTimes
                    className="text-red-700 cursor-pointer"
                    onClick={() => handleRemoveRow(index)}
                  />
                  <FormSelect
                    data={fields}
                    value={row.field}
                    handleChange={(e: any) =>
                      handleChange({
                        field: "field",
                        value: e.target.value,
                        index: index,
                      })
                    }
                  />
                </div>
              </TableCell>
              <TableCell>
                <FormSelect
                  data={ConditionTypes}
                  value={row.conditionType}
                  handleChange={(e: any) =>
                    handleChange({
                      field: "conditionType",
                      value: e.target.value,
                      index: index,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <MUITextField
                  label=""
                  placeholder="Value"
                  className="bg-white"
                  value={row.value}
                  onChange={(e: any) =>
                    handleChange({
                      field: "value",
                      value: e.target.value,
                      index: index,
                    })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const FormSelect: React.FC<any> = ({ data, handleChange, value }: any) => {
  return (
    <FormControl sx={{ m: 1, width: "100%" }} size="small">
      <Select
        value={value}
        label=""
        onChange={handleChange}
        className="w-full text-xs text-field px-4"
      >
        {data?.map((item: any, index: number) => (
          <MenuItem key={index} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
