/**
 * Interface representing a Chiclet.
 */
export interface Chiclet {
  /** The unique identifier of the Chiclet. */
  id: string

  /** The CSS class of the Chiclet. Optional. */
  cssClass?: string

  /** The title of the Chiclet. */
  title: string

  /** The icons of the Chiclet. Optional. */
  icons?: Array<string>

  /** Indicates whether the Chiclet is visible. */
  isVisible: boolean

  /** The link of the Chiclet. Optional. */
  link?: { href: string; target: string }

  /** The onclick event handler of the Chiclet. Optional. */
  onclick?: () => void
}
