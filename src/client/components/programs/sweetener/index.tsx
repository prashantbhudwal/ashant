import { SweetenerTable } from './sweetener-table'
import { ProgramLayout } from '../program-layout'
import type { TSpace } from '~/common/types/content.types'

interface SweetenerSpaceProps {
  config?: Pick<TSpace, 'layoutWidth' | 'supportsMobile'>
}

export function SweetenerSpace({ config }: SweetenerSpaceProps) {
  return (
    <ProgramLayout
      title="Sweeteners"
      description="Compare sweeteners by glycemic index, sweetness, and more."
      layoutWidth={config?.layoutWidth}
      supportsMobile={config?.supportsMobile}
    >
      <SweetenerTable />
    </ProgramLayout>
  )
}
