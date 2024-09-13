import type { TrackingService } from '../analytics'
import type { BootstrappedComponent } from './BootstrappedComponent'

export interface AppComponentProps {
  navigationBootstrappedComponent?: BootstrappedComponent,
  headerBootstrappedComponent?: BootstrappedComponent,
  footerBootstrappedComponent?: BootstrappedComponent,
  trackingService?: TrackingService,
  globalClickHandler?: (event: MouseEvent) => void,
  additionalComponents?: Array<BootstrappedComponent>,
}
