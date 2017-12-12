import { EntityFilters, createEntityFiltersProvider } from '../../ngrx-data';

/** EntityFilter function: match pattern in the name or the saying. */
// AOT requires export
export function NameOrSayingFilterFn<T>(entities: T[], pattern: string) {
  pattern = pattern && pattern.trim();
  if (!pattern) {
    return entities;
  }
  const regEx = new RegExp(pattern, 'i');
  return entities.filter((e: any) => regEx.test(e.name) || regEx.test(e.saying));
}

export const NAME_OR_SAYING_FILTER = 'NameOrSaying';

/** Custom application entity filters */
// AOT requires export; cannot write [NAME_OR_SAYING_FILTER]
export const entityFilters: EntityFilters = {
  NameOrSaying: { filterFn: NameOrSayingFilterFn }
  // '': { filterFn: NameOrSayingFilterFn } // replace the default
};

export const entityFiltersProvider = createEntityFiltersProvider(entityFilters);
