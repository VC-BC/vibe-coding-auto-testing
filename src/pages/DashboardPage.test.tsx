import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogout = vi.fn();
let mockUser: { username: string; role: 'user' | 'admin' } = { username: 'dean', role: 'user' };

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        logout: mockLogout,
    }),
}));

const mockGetProducts = vi.fn();
vi.mock('../api/productApi', () => ({
    productApi: { getProducts: () => mockGetProducts() },
}));

// ─── helper ──────────────────────────────────────────────────────────────────

function renderDashboard() {
    render(
        <MemoryRouter>
            <DashboardPage />
        </MemoryRouter>
    );
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('DashboardPage', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockLogout.mockReset();
        mockGetProducts.mockResolvedValue([]);
        mockUser = { username: 'dean', role: 'user' };
    });

    describe('前端元素', () => {
        it('渲染頁面標題與登出按鈕', async () => {
            renderDashboard();

            expect(screen.getByRole('heading', { name: '儀表板' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '登出' })).toBeInTheDocument();
        });
    });

    describe('驗證權限', () => {
        it('admin 角色顯示管理後台連結', async () => {
            mockUser = { username: 'dean', role: 'admin' };

            renderDashboard();

            expect(await screen.findByRole('link', { name: /管理後台/ })).toBeInTheDocument();
        });

        it('user 角色不顯示管理後台連結', async () => {
            renderDashboard();
            // wait for loading to finish
            await waitFor(() => expect(screen.queryByText('載入商品中...')).not.toBeInTheDocument());

            expect(screen.queryByRole('link', { name: /管理後台/ })).not.toBeInTheDocument();
        });
    });

    describe('Mock API', () => {
        it('成功載入商品列表', async () => {
            mockGetProducts.mockResolvedValue([
                { id: 1, name: '筆記型電腦', price: 25000, description: '輕薄高效能' },
                { id: 2, name: '無線滑鼠', price: 890, description: '人體工學設計' },
            ]);

            renderDashboard();

            expect(await screen.findByText('筆記型電腦')).toBeInTheDocument();
            expect(await screen.findByText('無線滑鼠')).toBeInTheDocument();
            expect(screen.getByText('NT$ 25,000')).toBeInTheDocument();
        });
    });

    describe('function 邏輯', () => {
        it('點擊登出後導向 `/login`', async () => {
            renderDashboard();
            await waitFor(() => expect(screen.queryByText('載入商品中...')).not.toBeInTheDocument());

            await userEvent.click(screen.getByRole('button', { name: '登出' }));

            expect(mockLogout).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true, state: null });
        });
    });
});
