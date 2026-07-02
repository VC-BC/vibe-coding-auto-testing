---
description: 測試案例 - DashboardPage
---

> 狀態：初始為 [ ], 完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】渲染頁面標題與登出按鈕
**範例輸入**： user: `{ username: 'dean', role: 'user' }`
**期待輸出**： 顯示「儀表板」標題與「登出」按鈕。

---

## [x] 【驗證權限】admin 角色顯示管理後台連結
**範例輸入**： user: `{ username: 'dean', role: 'admin' }`
**期待輸出**： 顯示「管理後台」link。

---

## [x] 【驗證權限】user 角色不顯示管理後台連結
**範例輸入**： user: `{ username: 'dean', role: 'user' }`
**期待輸出**： 不顯示「管理後台」link。

---

## [x] 【Mock API】成功載入商品列表
**範例輸入**： `GET /api/products` 回傳商品陣列
**期待輸出**： 顯示商品名稱、描述、價格。

---

## [x] 【function 邏輯】點擊登出後導向 `/login`
**範例輸入**： 點擊「登出」按鈕
**期待輸出**： 呼叫 `logout()`，導向 `/login`。
