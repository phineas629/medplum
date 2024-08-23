// Export common utilities or components
export * from './utils/common';
export * from './components/shared';

// Re-export sub-projects if needed
export { App as CoreApp } from './core/src/App';
export { App as HelloWorldApp } from './hello-world/src/App';
// ... other exports as needed
