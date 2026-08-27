/** @jest-environment jsdom */

import { createElement, type ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { AuthContextValue } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ROUTES } from '../../shared/constants/routes';

const authUser = {
  id: '1',
  name: 'Ana',
  email: 'ana@example.com',
  role: 'USER' as const,
};

const adminUser = {
  id: '2',
  name: 'Bruno',
  email: 'bruno@example.com',
  role: 'ADMIN' as const,
};

const createAuthValue = (overrides: Partial<AuthContextValue>): AuthContextValue => ({
  user: null,
  status: 'anonymous',
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  restoreSession: jest.fn(),
  ...overrides,
});

const LocationProbe = ({ onLocation }: { onLocation: (pathname: string) => void }) => {
  const location = useLocation();
  onLocation(location.pathname + location.search);
  return null;
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
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  });
};

const waitForText = async (container: HTMLElement, text: string) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (container.textContent?.includes(text)) {
      return;
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
    });
  }

  throw new Error(`Missing text: ${text}`);
};

const renderWithRouter = (element: ReactNode, entries: string[] = [ROUTES.HOME]) => {
  const container = document.createElement('div');
  const root: Root = createRoot(container);

  act(() => {
    root.render(createElement(MemoryRouter, { initialEntries: entries }, element));
  });

  return {
    container,
    root,
  };
};

describe('auth routing', () => {
  test('ProtectedRoute keeps the loading state visible while auth is resolving', () => {
    const { container, root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'loading' }),
        children: createElement(
          Routes,
          {},
          createElement(Route, {
            path: '/',
            element: createElement(ProtectedRoute, {
              allowedRoles: ['USER'],
              children: createElement('main', {}, 'Protected'),
            }),
          }),
        ),
      }),
    );

    expect(container.textContent).toContain('Carregando');

    act(() => {
      root.unmount();
    });
  });

  test('ProtectedRoute sends anonymous visitors to /login', async () => {
    let pathname = '';
    const { root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'anonymous' }),
        children: createElement(
          Routes,
          {},
          createElement(Route, {
            path: '/painel',
            element: createElement(
              ProtectedRoute,
              {
                allowedRoles: ['USER'],
                children: createElement('main', {}, 'Protected'),
              },
            ),
          }),
          createElement(Route, {
            path: '*',
            element: createElement(LocationProbe, { onLocation: (value) => { pathname = value; } }),
          }),
        ),
      }),
      ['/painel'],
    );

    await act(async () => {});

    expect(pathname).toBe('/login');

    act(() => {
      root.unmount();
    });
  });

  test('ProtectedRoute sends a USER away from the admin area to the panel', async () => {
    let pathname = '';
    const { root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'authenticated', user: authUser }),
        children: createElement(
          Routes,
          {},
          createElement(Route, {
            path: '/admin',
            element: createElement(
              ProtectedRoute,
              {
                allowedRoles: ['ADMIN'],
                children: createElement('main', {}, 'Protected'),
              },
            ),
          }),
          createElement(Route, {
            path: '*',
            element: createElement(LocationProbe, { onLocation: (value) => { pathname = value; } }),
          }),
        ),
      }),
      ['/admin'],
    );

    await act(async () => {});

    expect(pathname).toBe(ROUTES.PANEL);

    act(() => {
      root.unmount();
    });
  });

  test('PublicOnlyRoute sends an authenticated user away from /login', async () => {
    let pathname = '';
    const { root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'authenticated', user: adminUser }),
        children: createElement(
          Routes,
          {},
          createElement(Route, {
            path: ROUTES.LOGIN,
            element: createElement(PublicOnlyRoute, { children: createElement(LoginPage) }),
          }),
          createElement(Route, {
            path: '*',
            element: createElement(LocationProbe, { onLocation: (value) => { pathname = value; } }),
          }),
        ),
      }),
      [ROUTES.LOGIN],
    );

    await act(async () => {});

    expect(pathname).toBe(ROUTES.ADMIN);

    act(() => {
      root.unmount();
    });
  });

  test('LoginPage rejects an invalid email and a short password', async () => {
    const { container, root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'anonymous' }),
        children: createElement(LoginPage),
      }),
      [ROUTES.LOGIN],
    );

    setInputValue(container, 'E-mail', 'not-an-email');
    setInputValue(container, 'Senha', '123');

    const form = container.querySelector<HTMLFormElement>('form');
    if (!form) throw new Error('Missing form');

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitForText(container, 'Informe um e-mail válido');
    await waitForText(container, 'A senha deve ter pelo menos 6 caracteres');

    act(() => {
      root.unmount();
    });
  });

  test('RegisterPage rejects mismatched password confirmation', async () => {
    const { container, root } = renderWithRouter(
      createElement(AuthContext.Provider, {
        value: createAuthValue({ status: 'anonymous' }),
        children: createElement(RegisterPage),
      }),
      [ROUTES.REGISTER],
    );

    setInputValue(container, 'Nome completo', 'Ana Silva');
    setInputValue(container, 'E-mail', 'ana@example.com');
    setInputValue(container, 'Senha', '123456');
    setInputValue(container, 'Confirmar senha', '654321');

    const form = container.querySelector<HTMLFormElement>('form');
    if (!form) throw new Error('Missing form');

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitForText(container, 'As senhas não coincidem');

    act(() => {
      root.unmount();
    });
  });
});
