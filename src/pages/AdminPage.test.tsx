import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AdminPage } from './AdminPage';

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogout = vi.fn();

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { username: 'dean', role: 'admin' },
        logout: mockLogout,
    }),
}));

// ─── helper ──────────────────────────────────────────────────────────────────

function renderAdminPage() {
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>
    );
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('AdminPage', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockLogout.mockReset();
    });

    describe('前端元素', () => {
        it('渲染管理後台頁面內容', () => {
            renderAdminPage();

            expect(screen.getByRole('heading', { name: /管理後台/ })).toBeInTheDocument();
            expect(screen.getByText('只有 admin 角色可以訪問')).toBeInTheDocument();
            expect(screen.getByText('user 角色會被重定向')).toBeInTheDocument();
            expect(screen.getByText('受路由守衛保護')).toBeInTheDocument();
        });

        it('顯示返回儀表板連結', () => {
            renderAdminPage();

            const backLink = screen.getByRole('link', { name: '← 返回' });
            expect(backLink).toBeInTheDocument();
            expect(backLink).toHaveAttribute('href', '/dashboard');
        });
    });

    describe('function 邏輯', () => {
        it('點擊登出後導向 `/login`', async () => {
            renderAdminPage();

            await userEvent.click(screen.getByRole('button', { name: '登出' }));

            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true, state: null });
        });
    });
});
