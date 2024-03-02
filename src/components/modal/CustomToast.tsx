import React, { RefObject } from "react";

import { Alert, Snackbar } from "@mui/material";

interface CustomToastProps {
  ref?: RefObject<CustomToast>;
}
// type CustomToastType = 'error' | 'success' | 'warning'

class CustomToast extends React.Component<CustomToastProps> {
  state = { open: false, message: "", title: "", isError: false, id: null };

  open(message?: string) {
    this.setState({
      open: true,
      message: message ?? ' Please complete all required fields before proceeding to the next tab.',
    });
  }

  onClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Snackbar
        open={this.state.open}
        autoHideDuration={6000}
        onClose={() => this.onClose()}
      >
        <Alert
          onClose={() => this.onClose()}
          severity="error"
          sx={{ width: "100%" }}
        >
          {this.state.message}
        </Alert>
      </Snackbar>
    );
  }
}

export default CustomToast;
