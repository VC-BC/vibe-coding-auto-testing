---
description: 測試案例 - AdminPage
---

> 狀態：初始為 [ ], 完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】渲染管理後台頁面內容
**範例輸入**： user: `{ username: 'dean', role: 'admin' }`
**期待輸出**： 顯示「管理後台」標題、三個 feature-item（只有 admin 可訪問、user 會被重定向、受路由守衛保護）。

---

## [x] 【前端元素】顯示返回儀表板連結
**範例輸入**： 無
**期待輸出**： 包含「← 返回」link 指向 `/dashboard`。

---

## [x] 【function 邏輯】點擊登出後導向 `/login`
**範例輸入**： 點擊「登出」按鈕
**期待輸出**： 呼叫 `logout()`，導向 `/login`。
