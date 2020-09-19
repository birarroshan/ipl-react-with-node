import React, { lazy, Suspense } from 'react';

const LazyEntryForm = lazy(() => import('./EntryForm'));

const EntryForm = props => (
  <Suspense fallback={null}>
    <LazyEntryForm {...props} />
  </Suspense>
);

export default EntryForm;
