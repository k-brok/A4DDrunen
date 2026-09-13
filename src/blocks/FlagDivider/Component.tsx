import React from 'react'

export const FlagDividerBlock: React.FC = () => {
  return (
    <div
      className="pointer-events-none h-[80px] w-full bg-repeat-x"
      style={{
        backgroundImage: 'url("/img/Vlaggetjes.svg")',
        backgroundPosition: 'bottom center',
        backgroundSize: '1200px 80px',
      }}
      aria-hidden="true"
    />
  )
}
