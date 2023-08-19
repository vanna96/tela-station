import MainContainer from '@/components/MainContainer';
import ItemCard from '@/components/card/ItemCart';
import React from 'react'

import { AiOutlineFileSync, AiOutlineSolution, AiOutlineFileExclamation, AiOutlineFileText } from "react-icons/ai";
import { Navigate, useNavigate } from 'react-router-dom';


export default function LogisticMasterPage() {
    const navigate = useNavigate();

    const goTo = (route: string) => navigate('/logistic/' + route);
    return (
        <>
            <MainContainer title='Inventory'>
                <div className='col-span-6 '>Master Data</div>
                <ItemCard amount={0} title='Driver' onClick={() => goTo('driver')} icon={<AiOutlineFileSync />} />
                <ItemCard amount={0} title='Vehicel' onClick={() => goTo('vehicel')} icon={<AiOutlineSolution />} />
                <ItemCard amount={0} title='Route Master' onClick={() => goTo('route-master')} icon={<AiOutlineFileExclamation />} />
                <ItemCard amount={0} title='Check List' icon={<AiOutlineFileExclamation />} />
                <div className='col-span-6'>Transportation </div>
                <ItemCard amount={0} title='Open Delivery' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Transportation Order' onClick={() => goTo('transportation-order')} icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Transportation Order Open' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Open Delivery' onClick={() => goTo('open-delivery')} icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Transportation Order' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Transportation Order Open' onClick={() => goTo('open-transportation')} icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Transportation Order Close' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Available Vehicle' icon={<AiOutlineFileText />} />
                <div className='col-span-6'> </div>
                <ItemCard amount={0} title='Route Process' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Available Vehicle' icon={<AiOutlineFileText />} />
                <ItemCard amount={0} title='Route Complete ' icon={<AiOutlineFileText />} />
            </MainContainer>
        </>
    )
}
