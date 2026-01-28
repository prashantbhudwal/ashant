import { SweetenerTable } from './sweetener-table'
import { SpaceLayout } from '../space-layout'
import type { TSpace } from '~/common/types/content.types'

interface SweetenerSpaceProps {
  config?: Pick<TSpace, 'layoutWidth' | 'supportsMobile'>
}

export function SweetenerSpace({ config }: SweetenerSpaceProps) {
  return (
    <SpaceLayout
      title="Sweeteners"
      description="Compare sweeteners by glycemic index, sweetness, and more."
      layoutWidth={config?.layoutWidth}
      supportsMobile={config?.supportsMobile}
    >
      <SweetenerTable />
    </SpaceLayout>
  )
}
