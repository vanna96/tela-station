import MainContainer from '@/components/MainContainer';
import ItemCard from '@/components/card/ItemCart';
import BranchModal from '@/components/modal/BranhModal';
import React from 'react'
import { AiOutlineFileSync, AiOutlineSolution, AiOutlineFileExclamation, AiOutlineFileText } from "react-icons/ai";
import DimensionModal from './../../components/modal/DimensionsModal';
import UsersModal from '@/components/modal/UsersModal';
import DocumentNumberingModal from '@/components/modal/DocumentNumberingModal';

export default function SystemInitializeMasterPage() {
  const [openBranch, setOpenBranch] = React.useState(false);
  const [openDimension, setOpenDimension] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [openDoc, setOpenDoc] = React.useState(false);


  const previewBranch = React.useCallback(() => setOpenBranch(true), []);
  const closeBranch = React.useCallback(() => setOpenBranch(false), []);

  const previewDimension = React.useCallback(() => setOpenDimension(true), []);
  const closeDimension = React.useCallback(() => setOpenDimension(false), []);

  const previewUser = React.useCallback(() => setOpenUser(true), []);
  const closeUser = React.useCallback(() => setOpenUser(false), []);

  const previewDoc = React.useCallback(() => setOpenDoc(true), []);
  const closeDoc = React.useCallback(() => setOpenDoc(false), []);

  return (
    <>
      <MainContainer title='Inventory'>
        <ItemCard title='Branch' icon={<AiOutlineSolution />} onClick={previewBranch} />
        <ItemCard title='Dimension' icon={<AiOutlineFileSync />} onClick={previewDimension} />
        <ItemCard title='Document Numbering' icon={<AiOutlineFileExclamation />} onClick={previewDoc} />
        <ItemCard title='User Licensing' icon={<AiOutlineFileText />} />
        <ItemCard title='User Master Data' icon={<AiOutlineFileText />} onClick={previewUser} />
        {/* -------------------------------Modal---------------------------------- */}
        <BranchModal open={openBranch} onClose={closeBranch} />
        <DimensionModal open={openDimension} onClose={closeDimension} />
        <UsersModal open={openUser} onClose={closeUser} />
        <DocumentNumberingModal open={openDoc} onClose={closeDoc} />
      </MainContainer>
    </>
  )
}