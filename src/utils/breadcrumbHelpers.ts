export interface BreadcrumbItem {
  label: string
  path: string
  clickable: boolean
}

/**
 * Simple function to create breadcrumb items
 * @param items Array of breadcrumb items
 * @returns The breadcrumb items array
 */
export const breadcrumbs = (items: BreadcrumbItem[]): BreadcrumbItem[] => items

/**
 * Helper function to create breadcrumbs that start with "My Data"
 * @param additionalItems Additional breadcrumb items to append after "My Data"
 * @returns Breadcrumb items array starting with "My Data"
 */
export const myDataBreadcrumbs = (additionalItems: BreadcrumbItem[]): BreadcrumbItem[] => [
  { label: 'My Data', path: '/my-data', clickable: true },
  ...additionalItems
]

/**
 * Helper function to create breadcrumbs for product pages
 * @param productId The product ID
 * @param productLabel The user-facing product label (e.g., "Unitary Data")
 * @param additionalItems Additional breadcrumb items to append
 * @param isProductClickable Whether the product breadcrumb should be clickable (default: false)
 * @returns Breadcrumb items array for product pages
 */
export const productBreadcrumbs = (
  productId: string, 
  productLabel: string, 
  additionalItems: BreadcrumbItem[] = [],
  isProductClickable: boolean = false
): BreadcrumbItem[] => {
  return myDataBreadcrumbs([
    { label: productLabel, path: `/my-data/product/${productId}`, clickable: isProductClickable },
    ...additionalItems
  ])
}

/**
 * Helper function to create breadcrumbs for dataset pages
 * @param productId The product ID
 * @param productLabel The user-facing product label
 * @param datasetId The dataset ID
 * @param datasetLabel The user-facing dataset label
 * @returns Breadcrumb items array for dataset pages
 */
export const datasetBreadcrumbs = (
  productId: string,
  productLabel: string,
  datasetId: string,
  datasetLabel: string
): BreadcrumbItem[] => {
  return productBreadcrumbs(productId, productLabel, [
    { label: datasetLabel, path: `/my-data/dataset/${datasetId}`, clickable: false }
  ], true) // Product breadcrumb should be clickable when used from dataset view
}
