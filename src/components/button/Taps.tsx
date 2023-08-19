import { motion } from "framer-motion";
import React from "react";


interface TapsProps {
    items: string[],
    children: JSX.Element[],
}

const Taps: React.FC<TapsProps> = (props: TapsProps) => {
    const [toggle, setToggle] = React.useState<number>(0);

    const handlerClick = (index: number) => {
        setToggle(index);
    }

    return <>
        <div className='w-full flex gap-4 text-sm border-b'>
            {props.items.map((e: string, index: number) => <div key={Date.now() + index} role='button' onClick={() => handlerClick(index)} className={`p-2  hover:border-b-[3px] hover:border-b-blue-500 hover:text-blue-500 ${toggle === index ? 'border-b-[3px] border-b-blue-500 text-blue-500' : ''} `}>{e}</div>)}

        </div>
        {props.children[toggle]}
    </>
}


export default Taps;