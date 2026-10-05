# @flickerless/react

Official React components and hooks for Flickerless data surfaces.

## Installation

```bash
npm install @flickerless/react @flickerless/core
```

## Quick Start

```tsx
import { FlickerlessSurface } from '@flickerless/react';
import '@flickerless/core/styles.css';

export function InvoicesTable() {
  const { data, isLoading } = useInvoices();

  return (
    <FlickerlessSurface
      loading={isLoading}
      delayMs={180}
      empty={data?.length === 0}
      emptyState={<div>No hay facturas registradas.</div>}
    >
      <table>
        <thead>...</thead>
        <tbody>
          {data?.map(invoice => (
            <tr key={invoice.id}>...</tr>
          ))}
        </tbody>
      </table>
    </FlickerlessSurface>
  );
}
```
