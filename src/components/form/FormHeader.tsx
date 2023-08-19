import React from 'react'

import BackButton from "../button/BackButton"
import { HiOutlineEye, HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight, HiOutlineDocumentAdd, HiOutlineChevronDown } from "react-icons/hi";


interface FormHeaderProps {
    title: string;
}


const FormHeader: React.FC<FormHeaderProps> = (props: FormHeaderProps) => {


    const [collapse, setCollapse] = React.useState<boolean>(false);

    return <>
        <div className=" rounded-lg px-6 py-4 flex items-center justify-between sticky top-3 gap-3  border-b bg-white shadow-sm xl:text-sm font-bold z-20">
            <div className="flex gap-3 items-center">
                <BackButton />
                <div>{props.title}</div>
            </div>

            <div className="px-3 flex items-center gap-3">
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiOutlineDocumentAdd className="" /></div>
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiOutlineEye className="" /></div>
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronDoubleLeft className="" /></div>
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronLeft className="" /></div>
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronRight className="" /></div>
                <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronDoubleRight className="" /></div>
            </div>
            <div role="button"
                onClick={() => { }}
                className={`hover:border absolute left-[45%] -bottom-4 p-[8px] bg-white hover:bg-gray-200 border shadow rounded-full text-xl text-gray-600 transition-all transform duration-200 delay-100 ${collapse ? 'rotate-0' : 'rotate-180'}`}> <HiOutlineChevronDown />
            </div>
        </div>

        <div className={`w-full p-3 flex justify-between gap-3 stick ${collapse ? '' : 'hidden'} transition-transform  delay-100 duration-200  my-3 rounded-lg xl:text-sm font-bold bg-white shadow-sm border z-10`}>
            <div></div>
            <div className="flex items-center">
                <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}
                >
                    <span className="">General</span>
                </div>
                <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}>Content</div>
                <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}>Attachment</div>
            </div>
        </div>

        {/* <div className={`grow flex flex-col gap-4 w-full ${collapse ? '' : 'mt-4'}`}>
            <div className='mt-4'></div>
        </div> */}
    </>
}

export default FormHeader;