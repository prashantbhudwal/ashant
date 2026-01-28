import React from 'react'

export function Home() {
  return (
    <>
      <FullPageScroller />
    </>
  )
}

type Section = {
  id: number
  label: string
  className: string
}

const sections: Section[] = [
  { id: 0, label: 'Section 1', className: 'bg-slate-900' },
  { id: 1, label: 'Section 2', className: 'bg-slate-700' },
  { id: 2, label: 'Section 3', className: 'bg-slate-500' },
]

const FullPageScroller: React.FC = () => {
  return (
    <div className="w-full snap-y snap-mandatory">
      {sections.map((section) => (
        <section
          key={section.id}
          className={`flex min-h-screen w-full snap-start items-center justify-center text-4xl font-bold text-white ${section.className}`}
        >
          {section.label}
        </section>
      ))}
    </div>
  )
}
