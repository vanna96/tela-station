import MainContainer from '@/components/MainContainer';
import ItemCard from '@/components/card/ItemCart';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { AiOutlineShopping, AiOutlineFileAdd, AiOutlineFileUnknown, AiOutlineSolution, AiOutlineSnippets, AiOutlineFileExcel, AiOutlineFileProtect } from "react-icons/ai";


const ProcumentPage = () => {

    const navigate = useNavigate();

    const goTo = (route: string) => navigate('/procument/' + route);
    return <>
        <MainContainer title='Procument'>
            <ItemCard amount={0} title='Purchase Agreement' onClick={() => goTo('purchase-agreement')} icon={<AiOutlineFileProtect />} />
            <ItemCard amount={0} title='Purchase Request' onClick={() => goTo('purchase-request')} icon={<AiOutlineFileProtect />} />
            <ItemCard amount={0} title='Purchase Quoatation' onClick={() => goTo('purchase-qoutation')} icon={<AiOutlineFileUnknown />} />
            <ItemCard amount={0} title='Purchase Order' onClick={() => goTo('purchase-order')} icon={<AiOutlineFileProtect />} />
            <ItemCard amount={0} title='Down Payment Request' onClick={() => goTo('purchase-down-payment')} icon={<AiOutlineSnippets />} />
            <ItemCard amount={0} title='Good Return Request' onClick={() => goTo('good-return-request')} icon={<AiOutlineFileProtect />} />
            <ItemCard amount={0} title='Expanse' icon={<AiOutlineFileExcel />} />
        </MainContainer>
    </>
}

export default ProcumentPage;