/** @jest-environment jsdom */

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryAppointmentGateway } from '../../infra/gateway/MemoryAppointmentGateway';
import { DependencyProvider } from '../context/DependencyContext';
import { useAdminDashboardController } from './useAdminDashboardController';

type ControllerValue = ReturnType<typeof useAdminDashboardController>;

const waitFor = async (assertion: () => void) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
      });
    }
  }

  throw lastError;
};

const AdminDashboardProbe = ({ onValue }: { onValue: (value: ControllerValue) => void }) => {
  onValue(useAdminDashboardController());
  return null;
};

describe('useAdminDashboardController', () => {
  test('resets the page when a filter changes and keeps pagination metadata in sync', async () => {
    const container = document.createElement('div');
    const root: Root = createRoot(container);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    let controller: ControllerValue | undefined;

    await act(async () => {
      root.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(
            DependencyProvider,
            null,
            createElement(AdminDashboardProbe, {
              onValue: (value) => {
                controller = value;
              },
            }),
          ),
        ),
      );
    });

    await waitFor(() => {
      expect(controller?.isLoading).toBe(false);
      expect(controller?.pagination.totalItems).toBe(4);
    });

    act(() => {
      controller?.setItemsPerPage(2);
    });

    await waitFor(() => {
      expect(controller?.pagination.itemsPerPage).toBe(2);
      expect(controller?.pagination.totalPages).toBe(2);
      expect(controller?.appointments.map((appointment) => appointment.id)).toEqual([
        'app-sun-001',
        'app-sun-002',
      ]);
    });

    act(() => {
      controller?.goToPage(2);
    });

    await waitFor(() => {
      expect(controller?.pagination.currentPage).toBe(2);
      expect(controller?.appointments.map((appointment) => appointment.id)).toEqual([
        'app-sun-003',
        'app-sun-004',
      ]);
    });

    act(() => {
      controller?.setAddressFilter('Paulista');
    });

    await waitFor(() => {
      expect(controller?.pagination.currentPage).toBe(1);
      expect(controller?.pagination.totalItems).toBe(1);
      expect(controller?.appointments.map((appointment) => appointment.id)).toEqual(['app-sun-002']);
    });

    await act(async () => {
      root.unmount();
    });
  });

  test('debounces the client filter before fetching again', async () => {
    jest.useFakeTimers();

    const appointmentGateway = new MemoryAppointmentGateway();
    const listAllSpy = jest.spyOn(appointmentGateway, 'listAll');
    const container = document.createElement('div');
    const root: Root = createRoot(container);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    let controller: ControllerValue | undefined;

    await act(async () => {
      root.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(
            DependencyProvider,
            { overrideDependencies: { appointmentGateway } },
            createElement(AdminDashboardProbe, {
              onValue: (value) => {
                controller = value;
              },
            }),
          ),
        ),
      );
      await Promise.resolve();
    });

    expect(listAllSpy).toHaveBeenCalledTimes(1);

    act(() => {
      controller?.setClientFilter('L');
      controller?.setClientFilter('Lu');
      controller?.setClientFilter('Luc');
      controller?.setClientFilter('Luca');
      controller?.setClientFilter('Lucas');
    });

    expect(controller?.clientFilter).toBe('Lucas');
    expect(listAllSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(399);
      await Promise.resolve();
    });

    expect(listAllSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(listAllSpy).toHaveBeenCalledTimes(2);
    expect(listAllSpy).toHaveBeenLastCalledWith({
      client: 'Lucas',
      address: undefined,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });

    await act(async () => {
      root.unmount();
    });

    jest.useRealTimers();
  });
});
