import React from 'react'

const SectionHeader = ({title,subtitle}) => {
  return (
    <div>
        <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
        <p className='text-gray-600 mt-1'>{subtitle}</p>
    </div>
  )
}

export default SectionHeader