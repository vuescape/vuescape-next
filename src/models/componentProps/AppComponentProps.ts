import type { TrackingService } from '../../analytics'
import type { BootstrappedComponent } from '../BootstrappedComponent'

/**
 * Interface representing the properties for the root application component.
 *
 * @interface AppComponentProps
 * 
 * @property navigationBootstrappedComponent - The bootstrapped component for navigation.
 * @property headerBootstrappedComponent - The bootstrapped component for the header.
 * @property footerBootstrappedComponent - The bootstrapped component for the footer.
 * @property trackingService - The service used for tracking.
 * @property globalClickHandler - A handler for global click events.
 * @property additionalComponents - An array of additional bootstrapped components.
 */
export interface AppComponentProps {
  navigationBootstrappedComponent?: BootstrappedComponent,
  headerBootstrappedComponent?: BootstrappedComponent,
  footerBootstrappedComponent?: BootstrappedComponent,
  trackingService?: TrackingService,
  globalClickHandler?: (event: MouseEvent) => void,
  additionalComponents?: Array<BootstrappedComponent>,
}
