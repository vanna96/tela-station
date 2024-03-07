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
            U_tl_doc_date: new Date().toISOString()?.split('T')[0],
            U_tl_bplid: undefined,
            TL_FUEL_LEVEL_LINESCollection: []
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