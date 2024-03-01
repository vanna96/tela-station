import request from "@/utilies/request";
import { useForm } from "react-hook-form";

export const useDepositHook = ({
  props,
  state,
  setState,
  id,
  dialog,
}: {
  state: any;
  setState: any;
  props: any;
  id: any;
  dialog: any;
}) => {
  const {
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors, defaultValues },
  } = useForm();

  const onSubmit = async (e: any) => {
    const payload: any = {
      ...e,
    };
    try {
      setState({ ...state, isSubmitting: true });

      if (props.edit) {
        await request("PATCH", `/Deposits(${id})`, payload)
          .then((res: any) => {
            console.log(res);
            return dialog.current?.success("Update Successfully.", id);
          })
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      } else {
        await request("POST", "/Deposits", payload)
          .then((res: any) =>
            dialog.current?.success("Create Successfully.", res?.data?.AbsEntry)
          )
          .catch((err: any) => dialog.current?.error(err.message))
          .finally(() => setState({ ...state, isSubmitting: false }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setState({ ...state, isSubmitting: false });
    }
  };

  const onInvalidForm = (invalids: any) => {
    dialog.current?.error(
      invalids[Object.keys(invalids)[0]]?.message?.toString() ??
        "Oop something wrong!",
      "Invalid Value"
    );
  };

  return {
    onSubmit,
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    reset,
    getValues,
    onInvalidForm,
  };
};
