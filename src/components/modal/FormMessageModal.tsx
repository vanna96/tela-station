import React, { FC, RefObject } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";
import { HiDocumentCheck } from "react-icons/hi2";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface FormMessageModalProps {
  ref?: RefObject<FormMessageModal>;
}

class FormMessageModal extends React.Component<FormMessageModalProps> {
  state = { open: false, message: "", title: "", isError: false, id: null };

  success(message: string, id: number) {
    this.setState({
      open: true,
      isError: false,
      title: "Success",
      message: message,
      id: id,
    });
  }

  error(message: string, title?: string) {
    this.setState({
      open: true,
      isError: true,
      title: title ?? "Invalid",
      message: message,
    });
  }

  onClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Transition appear show={this.state.open} as={Fragment}>
        <Dialog as="div" className="relative z-[100] " onClose={this.onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto w-full ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-[28rem] shadow-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className={`px-6 shadow py-3 w-full  flex  items-center gap-2 text-lg font-base leading-6 ${
                      this.state.isError ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {this.state.isError ? (
                      <BsExclamationCircle />
                    ) : (
                      <HiDocumentCheck className="text-lg" />
                    )}{" "}
                    <span>{this.state.title}</span>
                  </Dialog.Title>
                  <div className="px-6 pt-3 pb-4 border border-t">
                    <div className="text-sm text-gray-600 my-4">
                      {this.state.message}
                    </div>

                    <div className="mt-4 flex gap-2 justify-end border-t pt-4">
                      {this.state.isError ? (
                        <Button
                          variant="contained"
                          disableElevation
                          size="small"
                          sx={{
                            backgroundColor: this.state.isError
                              ? "#f87171"
                              : "#60a5fa",
                            ":hover": {
                              backgroundColor: this.state.isError
                                ? "#ef4444"
                                : "#3b82f6",
                            },
                          }}
                          onClick={() => this.setState({ open: false })}
                        >
                          <span className="capitalize text-white text-xs">
                            Close
                          </span>
                        </Button>
                      ) : (
                        <>
                          <ReplaceRouteButton
                            isError={this.state.isError}
                            flag={1}
                            id={this.state.id}
                            onClick={() => this.setState({...this.state, open: false})}
                          >
                            View Detail
                          </ReplaceRouteButton>
                          {/* <ReplaceRouteButton
                            isError={this.state.isError}
                            flag={0}
                          >
                            Back To Lists
                          </ReplaceRouteButton> */}
                          <BackToList></BackToList>
                        </>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
}

export default FormMessageModal;

const ReplaceRouteButton = (props: any) => {
  const route = useNavigate();
  const history = useLocation();

  const navigateTo = () => {
    if (props.flag === 0) {
      route(-1); // Navigates back
    }
    const id = props.id;
    const isEdit = history.pathname.includes("edit");

    if (isEdit) {
      const baseUrl = history.pathname.replace(`/edit`, "");
      const url = isEdit ? baseUrl : `${baseUrl}`;
      route(url);
    }
    if (!isEdit) route(history.pathname.replace("create", "") + id);

    if (props?.onClick) props?.onClick()
  };

  return (
    <Button
      variant="contained"
      disableElevation
      size="small"
      sx={{
        backgroundColor: props.isError ? "#f87171" : "#60a5fa",
        ":hover": {
          backgroundColor: props.isError ? "#ef4444" : "#3b82f6",
        },
      }}
      onClick={navigateTo}
    >
      <span className="capitalize text-white text-[12px]">
        {props?.children}
      </span>
    </Button>
  );
};

const BackToList = () => {
  const route = useNavigate();
  const history = useLocation();

  const navigateTo = () => {
    const originalPath = history.pathname;
    const pathSegments = originalPath.split("/");
    const modifiedUrl = pathSegments.slice(0, 3).join("/");
    route(modifiedUrl);
  };

  return (
    <Button
      variant="contained"
      disableElevation
      size="small"
      sx={{
        backgroundColor: "#60a5fa",
        ":hover": {
          backgroundColor: "#3b82f6",
        },
      }}
      onClick={navigateTo}
    >
      <span className="capitalize text-white text-[12px]">Back to List</span>
    </Button>
  );
};
