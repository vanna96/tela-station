import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GeneralForm from "../components/GeneralForm";
import Consumption from "../components/Consumption";
import StockAllocationForm from "../components/StockAllocationForm";
import IncomingPaymentForm from "../components/IncomingPayment";
import CardCount from "../components/CardCountTable";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Assume this utility function exists and is imported
import { fetchData, saveData } from "../utils/dataManagement";

const Form = ({ edit }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    // Initialize with your default form state
    isLoading: true,
    data: {}, // This would include all the data fields required by your form
    showError: false,
    errorMessage: "",
  });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (edit) {
      // If in edit mode, fetch data
      const loadData = async () => {
        try {
          const data = await fetchData();
          setState((prevState) => ({ ...prevState, data, isLoading: false }));
        } catch (error) {
          console.error("Failed to fetch data", error);
          setState((prevState) => ({
            ...prevState,
            showError: true,
            errorMessage: "Failed to load data",
            isLoading: false,
          }));
        }
      };
      loadData();
    } else {
      // Not in edit mode, set loading to false
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, [edit]);

  const handleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      data: { ...prevState.data, [key]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      await saveData(state.data);
      navigate("/success"); // Redirect on success
    } catch (error) {
      console.error("Failed to save data", error);
      setState((prevState) => ({
        ...prevState,
        showError: true,
        errorMessage: "Failed to save data",
        isLoading: false,
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setState((prevState) => ({ ...prevState, showError: false }));
  };

  if (state.isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <GeneralForm data={state.data} onChange={handleChange} />
        <Consumption data={state.data} onChange={handleChange} />
        <StockAllocationForm data={state.data} onChange={handleChange} />
        <IncomingPaymentForm data={state.data} onChange={handleChange} />
        <CardCount data={state.data} onChange={handleChange} />
        <LoadingButton type="submit" loading={state.isLoading}>
          Submit
        </LoadingButton>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
      </form>
      <Snackbar
        open={state.showError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {state.errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Form;
