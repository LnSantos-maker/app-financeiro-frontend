import {test,expect} from '@playwright/test';
test('login dissolve antes de montar painel e espera dados', async({page})=>{
 await page.route('**/src/pages/Login.jsx*',r=>r.fulfill({contentType:'application/javascript',body:`import React from '/node_modules/.vite/deps/react.js'; import '/src/styles/cinematic.css'; export default function Login({onLoginSuccess}){return React.createElement('button',{onClick:()=>onLoginSuccess('teste@example.com')},'Login simulado')}`}));
 await page.route('**/src/pages/Dashboard.jsx*',r=>r.fulfill({contentType:'application/javascript',body:`import React from '/node_modules/.vite/deps/react.js'; export default function Dashboard({onInitialReady}){return React.createElement('button',{onClick:onInitialReady},'Dados prontos')}`}));
 await page.goto('/');await page.getByText('Login simulado').click();
 const cover=page.locator('.account-arrival');
 await expect(cover).toBeAttached();
 await expect(page.getByText('Dados prontos')).toBeVisible();
 await expect(cover).toHaveCSS('opacity','1');
 await page.getByText('Dados prontos').evaluate(el=>el.click());
 await expect(cover).toHaveCount(0);
 await page.reload();await expect(page.getByText('Dados prontos')).toBeVisible();await expect(cover).toHaveCount(0);
});
