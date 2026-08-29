/** @jest-environment jsdom */

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { AppointmentGateway } from '../../application/gateway/AppointmentGateway';
import { MemoryAppointmentGateway } from '../../infra/gateway/MemoryAppointmentGateway';
import { formatCurrency } from '../../shared/utils/formatters';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { DependencyProvider } from '../context/DependencyContext';
import { ReportsPage } from './ReportsPage';

const adminAuthValue: AuthContextValue = {
  user: { id: 'admin-1', name: 'Admin', email: 'admin@sunwash.com', role: 'ADMIN' },
  status: 'authenticated',
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  restoreSession: jest.fn(),
};

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

const getByTestId = (container: HTMLElement, testId: string) => {
  const element = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`Missing element with test id: ${testId}`);
  return element;
};

const setInputValue = (container: HTMLElement, label: string, value: string) => {
  const input = container.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`);
  if (!input) throw new Error(`Missing input: ${label}`);

  act(() => {
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    valueSetter?.call(input, value);
    if (!valueSetter) {
      input.value = value;
    }
    input.setAttribute('value', value);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: value, inputType: 'insertText' }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

const clickButton = (container: HTMLElement, label: string) => {
  const button = Array.from(container.querySelectorAll('button'))
    .find((candidate) => candidate.textContent?.includes(label));

  if (!button) {
    throw new Error(`Missing button: ${label}`);
  }

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  return button as HTMLButtonElement;
};

describe('ReportsPage', () => {
  test('shows filtered summary cards, export button and report rows for admin reporting', async () => {
    const appointmentGateway = new MemoryAppointmentGateway();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(
          QueryClientProvider,
          {
            client: queryClient,
            children: createElement(
              DependencyProvider,
              {
                overrideDependencies: { appointmentGateway },
                children: createElement(
                  AuthContext.Provider,
                  {
                    value: adminAuthValue,
                    children: createElement(MemoryRouter, null, createElement(ReportsPage)),
                  },
                ),
              },
            ),
          },
        ),
      );
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Painel de Relatórios');
      expect(container.textContent).toContain('Exportar para PDF');
      expect(getByTestId(container, 'reports-filtered-count').textContent).toBe('4');
      expect(getByTestId(container, 'reports-filtered-revenue').textContent).toBe(formatCurrency(1710));
      expect(container.textContent).toContain('Fernanda Souza');
      expect(container.textContent).toContain('Marcos Silveira');
    });

    setInputValue(container, 'Cliente', 'Ricardo');
    setInputValue(container, 'Data inicial', '2026-08-28');
    setInputValue(container, 'Data final', '2026-08-28');
    clickButton(container, 'Em andamento');

    await waitFor(() => {
      expect(getByTestId(container, 'reports-filtered-count').textContent).toBe('1');
      expect(getByTestId(container, 'reports-filtered-revenue').textContent).toBe(formatCurrency(480));
      expect(container.textContent).toContain('Av. Paulista');
      expect(container.textContent).toContain('Em andamento');
      expect(container.textContent).not.toContain('Fernanda Souza');
      expect(container.textContent).not.toContain('Marcos Silveira');
    });

    await act(async () => {
      root.unmount();
    });
  });

  test('exports the filtered report as a pdf blob and restores the button state', async () => {
    let resolveExport: ((value: Blob) => void) | undefined;
    const exportReport = jest.fn(() => new Promise<Blob>((resolve) => {
      resolveExport = resolve;
    }));
    const appointmentGateway = Object.assign(new MemoryAppointmentGateway(), {
      exportReport,
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const createObjectURL = jest.fn(() => 'blob:report-download');
    const revokeObjectURL = jest.fn();
    const anchorClick = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const originalCreateObjectURL = window.URL.createObjectURL;
    const originalRevokeObjectURL = window.URL.revokeObjectURL;
    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURL,
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURL,
    });

    const container = document.createElement('div');
    const root: Root = createRoot(container);

    try {
      await act(async () => {
        root.render(
          createElement(
            QueryClientProvider,
            {
              client: queryClient,
              children: createElement(
                DependencyProvider,
                {
                  overrideDependencies: {
                    appointmentGateway: appointmentGateway as unknown as AppointmentGateway,
                  },
                  children: createElement(
                    AuthContext.Provider,
                    {
                      value: adminAuthValue,
                      children: createElement(MemoryRouter, null, createElement(ReportsPage)),
                    },
                  ),
                },
              ),
            },
          ),
        );
      });

      await waitFor(() => {
        expect(container.textContent).toContain('Painel de Relatórios');
      });

      setInputValue(container, 'Cliente', 'Ricardo');
      setInputValue(container, 'Data inicial', '2026-08-28');
      setInputValue(container, 'Data final', '2026-08-28');
      clickButton(container, 'Em andamento');

      const exportButton = clickButton(container, 'Exportar para PDF');

      await waitFor(() => {
        expect(exportReport).toHaveBeenCalledWith({
          client: 'Ricardo',
          startDate: '2026-08-28',
          endDate: '2026-08-28',
          status: 'IN_PROGRESS',
        });
        expect(exportButton.disabled).toBe(true);
      });

      await act(async () => {
        resolveExport?.(new Blob(['pdf-content'], { type: 'application/pdf' }));
      });

      await waitFor(() => {
        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(anchorClick).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:report-download');
        expect(exportButton.disabled).toBe(false);
      });
    } finally {
      Object.defineProperty(window.URL, 'createObjectURL', {
        configurable: true,
        writable: true,
        value: originalCreateObjectURL,
      });
      Object.defineProperty(window.URL, 'revokeObjectURL', {
        configurable: true,
        writable: true,
        value: originalRevokeObjectURL,
      });
      anchorClick.mockRestore();

      await act(async () => {
        root.unmount();
      });
    }
  });

  test('shows an error toast when the pdf export fails', async () => {
    const appointmentGateway = Object.assign(new MemoryAppointmentGateway(), {
      exportReport: jest.fn().mockRejectedValue(new Error('Falha ao gerar PDF')),
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    try {
      await act(async () => {
        root.render(
          createElement(
            QueryClientProvider,
            {
              client: queryClient,
              children: createElement(
                DependencyProvider,
                {
                  overrideDependencies: {
                    appointmentGateway: appointmentGateway as unknown as AppointmentGateway,
                  },
                  children: createElement(
                    AuthContext.Provider,
                    {
                      value: adminAuthValue,
                      children: createElement(MemoryRouter, null, createElement(ReportsPage)),
                    },
                  ),
                },
              ),
            },
          ),
        );
      });

      await waitFor(() => {
        expect(container.textContent).toContain('Exportar para PDF');
      });

      clickButton(container, 'Exportar para PDF');

      await waitFor(() => {
        const alert = container.querySelector('[role="alert"]');
        expect(alert?.textContent).toContain('Falha ao gerar PDF');
      });
    } finally {
      await act(async () => {
        root.unmount();
      });
    }
  });
});
