# Project Structure

This document explains the restructured folder organization for the GaragePro application.

## 📁 Overview

The project follows a modular, feature-based architecture with clear separation of concerns.

```
src/
├── components/          # Reusable UI components organized by feature
│   ├── ui/             # Generic UI components (Modal, etc.)
│   ├── customers/      # Customer-specific components
│   ├── vehicles/       # Vehicle-specific components
│   └── services/       # Service-specific components
│
├── pages/              # Top-level page components
│   ├── DashboardPage.tsx
│   ├── CustomersPage.tsx
│   ├── ServicesPage.tsx
│   └── [other pages...]
│
├── lib/                # Library code and utilities
│   ├── supabase.ts     # Supabase client initialization
│   ├── supabaseClient.ts  # Re-export for convenience
│   ├── pdf/            # PDF generation logic
│   │   └── exportWorkOrder.ts
│   └── utils/          # Utility functions
│       ├── formatters.ts    # Date, currency, number formatting
│       └── calculations.ts  # Business logic calculations
│
├── types/              # TypeScript type definitions
│   ├── customer.ts
│   ├── vehicle.ts
│   ├── service.ts
│   ├── part.ts
│   ├── user.ts
│   ├── dashboard.ts
│   └── index.ts        # Re-exports all types
│
├── hooks/              # React custom hooks
│   └── useAuth.tsx
│
├── utils/              # General utilities
│   └── errorHandler.ts
│
└── App.tsx             # Main application component with routing
```

## 📂 Folder Descriptions

### `/components`
Contains all reusable React components, organized by feature domain.

#### `/components/ui`
- **Modal.tsx** - Reusable modal component for dialogs

#### `/components/customers`
- **CustomerList.tsx** - Renders list of customers with vehicles
- **CustomerForm.tsx** - Add/edit customer form

#### `/components/vehicles`
- **VehicleForm.tsx** - Add/edit vehicle form
- **VehicleCard.tsx** - Single vehicle display card

#### `/components/services`
- **ServiceForm.tsx** - Add/edit service record with multi-line input
- **ServiceList.tsx** - Show list of service records for a vehicle

### `/pages`
Top-level page components that compose smaller components.

- **DashboardPage.tsx** - Overview dashboard with statistics
- **CustomersPage.tsx** - Customer management page
- **ServicesPage.tsx** - Service management page
- **[Legacy pages]** - Inventory, PartForm, Auth, etc.

### `/lib`
Library code and external integrations.

#### `/lib/pdf`
- **exportWorkOrder.ts** - PDF generation using Supabase Edge Function

#### `/lib/utils`
- **formatters.ts** - Date, currency, and number formatting functions
- **calculations.ts** - Business logic (subtotal, VAT, total calculations)

### `/types`
TypeScript type definitions organized by domain.

- Each domain has its own file (customer.ts, vehicle.ts, etc.)
- `index.ts` re-exports all types for convenient importing

### `/utils`
General utility functions.

- **errorHandler.ts** - Logging and error handling utilities

## 🎯 Design Principles

### 1. Separation of Concerns
- **UI Components** are separated from **Business Logic**
- **Data Fetching** happens in page components
- **Calculations** are extracted into utility functions

### 2. Single Responsibility
- Each component has one clear purpose
- Large components are broken into smaller, focused pieces

### 3. Reusability
- Common UI patterns are extracted into reusable components
- Utility functions are shared across features

### 4. Type Safety
- All types are centralized in `/types`
- Strong typing throughout the application

### 5. Modularity
- Features are organized by domain (customers, vehicles, services)
- Easy to find and modify related code

## 📦 Import Patterns

### Types
```typescript
import type { Customer, Vehicle, ServiceRecord } from '../types';
```

### Components
```typescript
import { CustomerList } from '../components/customers/CustomerList';
import { Modal } from '../components/ui/Modal';
```

### Utilities
```typescript
import { formatDate, formatCurrency } from '../lib/utils/formatters';
import { calculateSubtotal } from '../lib/utils/calculations';
```

### Supabase
```typescript
import { supabase } from '../lib/supabase';
```

### PDF Export
```typescript
import { exportWorkOrderPdf } from '../lib/pdf/exportWorkOrder';
```

## 🔧 How to Add New Features

### Adding a New Feature Module

1. **Create types** in `/types/[feature].ts`
2. **Create components** in `/components/[feature]/`
3. **Create page** in `/pages/[Feature]Page.tsx`
4. **Add utilities** if needed in `/lib/utils/`
5. **Update routing** in `App.tsx`

### Example: Adding "Invoices" Feature

```
1. Create types/invoice.ts
2. Create components/invoices/InvoiceList.tsx
3. Create components/invoices/InvoiceForm.tsx
4. Create pages/InvoicesPage.tsx
5. Add lib/pdf/exportInvoice.ts if needed
6. Update App.tsx routing
```

## 🚀 Benefits of This Structure

1. **Easier Navigation** - Find code by feature, not by technical layer
2. **Better Scalability** - Add new features without cluttering existing code
3. **Improved Maintainability** - Clear boundaries between concerns
4. **Enhanced Testability** - Small, focused components are easier to test
5. **Team Collaboration** - Multiple developers can work on different features

## 📝 Notes

- **Legacy Files** - Some files (Inventory, PartForm, Dashboard, Customers, Services) in `/pages` are kept for compatibility
- **Migration Strategy** - New features should follow this structure; legacy code can be refactored incrementally
- **Naming Conventions** - Page components use `[Feature]Page.tsx` format for clarity

---

**Last Updated:** 2025-11-10
