import { useForm } from "react-hook-form";


export const useFuelLevelFormHook = () => {
    const {
        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues: {
            U_DocDate: new Date().toISOString()?.split('T')[0],
            U_BPLId: undefined,
            Collections: []
        }
    });


    const onSubmit = async (e: any) => {

    };

    const onInvalidForm = () => {

    }

    return {

        handleSubmit,
        register,
        setValue,
        control,
        reset,
        getValues,
        watch,
        // 
        onInvalidForm,
        onSubmit
    }
}