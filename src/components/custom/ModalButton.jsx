import React from 'react'
import { useState } from 'react';
const ModalButton = ({Modal,className,text,props}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
   <>
   <button onClick={() => setIsModalOpen(true)} className={className}>{text}</button>
   {isModalOpen && (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      {...props}
    />
  )}
   </>
  )
}

export default ModalButton