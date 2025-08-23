import React from 'react'
import { useState } from 'react';
const ModalButton = ({Modal,className,text,props, onCreate=()=>{}}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
   <>
   <button onClick={() => setIsModalOpen(true)} className={className}>{text}</button>
   {isModalOpen && (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onCreate={onCreate}
      {...props}
    />
  )}
   </>
  )
}

export default ModalButton