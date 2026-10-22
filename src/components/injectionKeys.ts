import type { InjectionKey, MaybeRef } from 'vue'

// Typed keys for values ancestors provide to vuescape components, so a provide and an inject that disagree on a key or
// its value's type fail to compile instead of silently falling back to the inject default.

// Whether VuescapeTable deep-watches its rows and columns; ReportLayoutRenderer provides it. The table's own deepWatch
// prop wins over it.
export const VuescapeTableDeepWatchKey: InjectionKey<boolean> = Symbol('VuescapeTable.deepWatch')

// A height (any CSS length, or a ref the ancestor updates) for VuescapeTable to use instead of filling the page. See
// VuescapeTable for when to provide it.
export const VuescapeTableScrollHeightKey: InjectionKey<MaybeRef<string>> = Symbol(
  'VuescapeTable.scrollHeight',
)
