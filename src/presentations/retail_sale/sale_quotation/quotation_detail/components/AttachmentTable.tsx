import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { url } from "@/utilies/request";
import loading from "../../../../../assets/img/loading.gif";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

type AttachmentTableProps = {
  Attachment: any;
  data?: any;
};

export const AttachmentTable = ({ Attachment, data }: AttachmentTableProps) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");

  const handleClose = () => setOpen(false);

  const handleOpen = async (id: any, file: any) => {
    setImage(`${url}/Attachments2(${id})/$value?filename='${file}'`);
    setOpen(true);
  };

  const availableAttachment =
    Attachment?.Attachments2_Lines.length > 0 ? true : false;

  if (Attachment === undefined && data?.AttachmentEntry)
    return (
      <div className="w-full h-full m-auto flex justify-center items-center mt-[40%]">
        <img
          className="bg-transparent w-[150px]"
          src={loading}
          alt="loading..."
        />
      </div>
    );

  return (
    <div>
      <Modal
        disableEnforceFocus
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={image}
          />
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="w-[10px]">
                <div className="font-bold">#</div>
              </TableCell>
              <TableCell align="left">
                <div className="font-bold">Target Path</div>
              </TableCell>
              <TableCell align="left">
                <div className="font-bold w-[100px]">Filename</div>
              </TableCell>
              <TableCell align="left">
                <div className="font-bold w-[150px]">Attachment Date</div>
              </TableCell>
              <TableCell align="left">
                <div className="font-bold w-[10px]">Display</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableAttachment
              ? Attachment?.Attachments2_Lines.map(
                  (row: any, index: number) => {
                    const fileName = `${row.FileName}.${row.FileExtension}`;
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{row.SourcePath}</TableCell>
                        <TableCell align="left">{fileName}</TableCell>
                        <TableCell align="left">
                          {row.AttachmentDate.split("T")[0]}
                        </TableCell>
                        <TableCell align="left">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() =>
                              handleOpen(row.AbsoluteEntry, fileName)
                            }
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
