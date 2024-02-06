import { Box, Modal } from "@mui/material";
import React from "react";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  pt: 3,
  px: 4,
  pb: 3,
  
};




const TRModal = (props:any) => {

  
    const handleClose = () => {
      props?.setOpen(false);
    };
  return (
    <>
      <Modal
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 700, height:500,borderRadius:2 }}>
          <h2 id="parent-modal-title">Text in a modal</h2>
          <p id="parent-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <h1>ABC</h1>
        </Box>
      </Modal>
    </>
  );

}
export default TRModal;