import MainContainer from '@/components/MainContainer';
import ItemCard from '@/components/card/ItemCart';
import BranchModal from '@/components/modal/BranhModal';
import React from 'react'
import { AiOutlineFileSync, AiOutlineSolution, AiOutlineFileExclamation, AiOutlineFileText } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


export default function InventoryMasterPage() {
    const navigate = useNavigate();
    const goTo = (route: string) => navigate('/inventory/' + route);
    return (
        <>
            <MainContainer title='Inventory'>
                <div className='col-span-6 '>Request Document</div>
                <ItemCard title='Internal Transfer Request' onClick={() => goTo('internal-transfer-request')} icon={<AiOutlineSolution />} />
                <ItemCard title='Stock Transfer Request' onClick={() => goTo('stock-transfer-request')} icon={<AiOutlineFileSync />} />
                <ItemCard title='Damage Transfer Request' onClick={() => goTo('stock-damage-request')} icon={<AiOutlineFileExclamation />} />
                <div className='col-span-6 border-b mt-3'></div>
                <div className='col-span-6 mb-3'>Transaction Document</div>
                <ItemCard title='Good Issue' icon={<AiOutlineFileText />}  onClick={() => goTo('good-issue')} />
                <ItemCard title='Good Receipt' icon={<AiOutlineFileText />} onClick={() => goTo('good-receipt')}  />
                <ItemCard title='Stock Transfer' onClick={() => goTo('stock-transfer')} icon={<AiOutlineFileSync />} />
            </MainContainer>
        </>
    )
}
