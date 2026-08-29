/** @jest-environment jsdom */

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import type { AuthGateway } from '../../application/gateway/AuthGateway';
import { LoginPage } from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';

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

const createGateway = (overrides: Partial<AuthGateway> = {}): AuthGateway => ({
  login: jest.fn(),
  logout: jest.fn(),
  me: jest.fn(),
  refresh: jest.fn().mockRejectedValue(new Error('Unauthorized')),
  register: jest.fn(),
  ...overrides,
});

const renderLoginPage = (gateway: AuthGateway) => {
  const container = document.createElement('div');
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      createElement(
        MemoryRouter,
        { initialEntries: ['/login'] },
        createElement(
          AuthProvider,
          { authGateway: gateway },
          createElement(LoginPage),
        ),
      ),
    );
  });

  return { container, root };
};

describe('useLoginController', () => {
  test('shows a friendly message when login fails with 401', async () => {
    const login = jest.fn().mockRejectedValue(Object.assign(new Error('Request failed with status code 401'), {
      response: {
        status: 401,
      },
    }));
    const { container, root } = renderLoginPage(createGateway({ login }));

    setInputValue(container, 'E-mail', 'ana@example.com');
    setInputValue(container, 'Senha', 'senha-segura');

    const form = container.querySelector<HTMLFormElement>('form');
    if (!form) throw new Error('Missing form');

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitForText(container, 'Email ou senha inválidos');
    expect(login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'senha-segura',
    });

    await act(async () => {
      root.unmount();
    });
  });

  test('falls back to a generic message for non-authentication failures', async () => {
    const { container, root } = renderLoginPage(
      createGateway({
        login: jest.fn().mockRejectedValue(new Error('Network Error')),
      }),
    );

    setInputValue(container, 'E-mail', 'ana@example.com');
    setInputValue(container, 'Senha', 'senha-segura');

    const form = container.querySelector<HTMLFormElement>('form');
    if (!form) throw new Error('Missing form');

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitForText(container, 'Não foi possível entrar agora.');

    await act(async () => {
      root.unmount();
    });
  });
});
