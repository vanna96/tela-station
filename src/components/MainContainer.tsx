import React from 'react'
import { motion } from "framer-motion"

interface MainContainer {
    title?: string,
    children?: JSX.Element | React.ReactNode,
}

export default function MainContainer({ title, children }: MainContainer) {
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='w-full h-full overflow-auto  p-6 flex flex-col gap-4 rounded-lg relative'>
                <div className=''>
                    <h1 className='text-base '>{title}</h1>
                </div>
                <div className='grid grid-cols-6 xl:grid-cols-6 gap-4 xl:gap-3 lg:grid-cols-3 sm:grid-cols-2 mb-10'>
                    {children}
                </div>
                <div className="h-[6rem]"></div>
            </motion.div>
        </>
    )
}
