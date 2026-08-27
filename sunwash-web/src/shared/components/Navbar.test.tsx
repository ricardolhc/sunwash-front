/** @jest-environment jsdom */

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

const useAuthMock = jest.fn();

jest.mock('../../presentation/context/useAuth', () => ({
  useAuth: () => useAuthMock(),
}));

const renderNavbar = () => {
  const container = document.createElement('div');
  const root: Root = createRoot(container);

  act(() => {
    root.render(createElement(MemoryRouter, null, createElement(Navbar)));
  });

  return { container, root };
};

describe('Navbar', () => {
  afterEach(() => {
    useAuthMock.mockReset();
  });

  test('shows auth buttons and hides role links for anonymous visitors', () => {
    useAuthMock.mockReturnValue({ status: 'anonymous', user: null, logout: jest.fn() });

    const { container, root } = renderNavbar();

    expect(container.textContent).toContain('Entrar');
    expect(container.textContent).toContain('Cadastrar');
    expect(container.textContent).not.toContain('Painel do Cliente');
    expect(container.textContent).not.toContain('Admin');

    act(() => {
      root.unmount();
    });
  });

  test('shows the client panel link for a USER and hides admin entry', () => {
    useAuthMock.mockReturnValue({
      status: 'authenticated',
      user: { id: '1', name: 'Ana', email: 'ana@example.com', role: 'USER' },
      logout: jest.fn(),
    });

    const { container, root } = renderNavbar();

    expect(container.textContent).toContain('Painel do Cliente');
    expect(container.textContent).not.toContain('Admin');
    expect(container.textContent).not.toContain('Entrar');
    expect(container.textContent).not.toContain('Cadastrar');
    expect(container.textContent).toContain('Sair');
    expect(container.textContent).not.toContain('Agendar Agora');
    expect(container.textContent).not.toContain('Solicitar Agendamento');
    expect(container.textContent).toContain('Sair');
    expect(container.textContent).not.toContain('Agendar Agora');
    expect(container.textContent).not.toContain('Solicitar Agendamento');

    act(() => {
      root.unmount();
    });
  });

  test('shows the admin link for an ADMIN and hides the client panel entry', () => {
    useAuthMock.mockReturnValue({
      status: 'authenticated',
      user: { id: '2', name: 'Bruno', email: 'bruno@example.com', role: 'ADMIN' },
      logout: jest.fn(),
    });

    const { container, root } = renderNavbar();

    expect(container.textContent).toContain('Admin');
    expect(container.textContent).not.toContain('Painel do Cliente');
    expect(container.textContent).not.toContain('Entrar');
    expect(container.textContent).not.toContain('Cadastrar');

    act(() => {
      root.unmount();
    });
  });
});
