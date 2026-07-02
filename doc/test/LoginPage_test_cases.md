---
description: 測試案例 - LoginPage
---

> 狀態：初始為 [ ], 完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】渲染登入表單
**範例輸入**： 無
**期待輸出**： 顯示 email、password 輸入框、提交按鈕、錯誤訊息區域。

---

## [x] 【驗證】Email 格式驗證
**範例輸入**： email: "invalid", password: "Pass1234"
**期待輸出**： 顯示 emailError 提示「請輸入有效的 Email 格式」。

---

## [x] 【驗證】密碼長度與字母數字
**範例輸入**： email: "test@example.com", password: "short"
**期待輸出**： 顯示 passwordError 「密碼必須至少 8 個字元」。

---

## [x] 【Mock API】成功登入後導向
**範例輸入**： 正確的 email 與 password
**期待輸出**： 登入成功，導向 /dashboard，並無錯誤訊息。
