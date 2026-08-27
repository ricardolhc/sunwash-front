import { useContext } from 'react';
import { DependencyContext } from './DependencyContext';
import type { DependencyContainer } from './DependencyContext';

export const useDependencies = (): DependencyContainer => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within a DependencyProvider');
  }
  return context;
};
