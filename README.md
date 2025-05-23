# vestas_assessment_app

Simple Task Manager application using Angular and Tailwind CSS.

## Features

- Add, edit, delete tasks
- Change task status (Todo, InProgress, Completed)
- Search/filter tasks by name or status (with debounce and clear button)
- Responsive UI with Tailwind CSS
- Modal dialogs for task editing and confirmation
- Notification system with multiple types (success, info, warning, error)
- User-friendly empty state for task list
- Loader/spinner overlay shown during loading operations

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm start
```
or
```bash
ng serve
```

The app will be available at [http://localhost:4200](http://localhost:4200).

### Build for production

```bash
ng build
```

## Project Structure

- `src/app/components/` — Angular components (task list, filter, modals, notifications, loader)
- `src/app/services/` — Application services (task store, API)
- `src/app/models/` — TypeScript interfaces and models

## Additional Notes

- The notification system supports multiple concurrent snackbars and four types: success, info, warning, error.
- Filtering is debounced and works instantly as you type, with a clear button for convenience.
- All modals and notifications are fully accessible and keyboard-friendly.
- The loader component displays a centered animated spinner while data is loading.
- The app uses Angular signals and RxJS for state management and reactivity.

---
