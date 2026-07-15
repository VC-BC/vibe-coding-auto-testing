import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
const mockClearAuthExpiredMessage = vi.fn();

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        authExpiredMessage: null,
        login: mockLogin,
        logout: vi.fn(),
        checkAuth: vi.fn().mockResolvedValue(false),
        clearAuthExpiredMessage: mockClearAuthExpiredMessage,
    }),
}));

// ─── helper ──────────────────────────────────────────────────────────────────

function renderLoginPage() {
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockLogin.mockReset();
        mockLogin.mockResolvedValue(undefined);
    });

    describe('前端元素', () => {
        it('渲染登入表單', () => {
            renderLoginPage();

            expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
            expect(screen.getByLabelText('密碼')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('驗證', () => {
        it('Email 格式驗證', async () => {
            renderLoginPage();

            await userEvent.type(screen.getByLabelText('電子郵件'), 'invalid');
            await userEvent.type(screen.getByLabelText('密碼'), 'Pass1234');
            fireEvent.submit(screen.getByRole('button', { name: '登入' }));

            expect(await screen.findByText('請輸入有效的 Email 格式')).toBeInTheDocument();
        });

        it('密碼長度與字母數字', async () => {
            renderLoginPage();

            await userEvent.type(screen.getByLabelText('電子郵件'), 'test@example.com');
            await userEvent.type(screen.getByLabelText('密碼'), 'short');
            fireEvent.submit(screen.getByRole('button', { name: '登入' }));

            expect(await screen.findByText('密碼必須至少 8 個字元跟日文dfbjwg')).toBeInTheDocument();
        });
    });

    describe('Mock API', () => {
        it('成功登入後導向', async () => {
            renderLoginPage();

            await userEvent.type(screen.getByLabelText('電子郵件'), 'test@example.com');
            await userEvent.type(screen.getByLabelText('密碼'), 'Pass1234');
            fireEvent.submit(screen.getByRole('button', { name: '登入' }));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Pass1234');
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
            });

            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });
});
