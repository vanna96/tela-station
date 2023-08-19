import React from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
    const navigate = useNavigate();


    const onBack = () => navigate(-1);

    return (
        <div role="button" onClick={onBack} className=" hover:bg-gray-200 rounded-lg p-2 px-3"><FaArrowLeft /></div>
    )
}