import{test,expect} from '@playwright/test'
test('has title',async({page})=>{
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await expect(page).toHaveTitle("Your Store");
});

test('website text matches',async({page})=>{
await page.goto("https://ecommerce-playground.lambdatest.io/");
await expect(page.getByText("This is a dummy website for Web Automation Testing")).toBeVisible();
});

test('verify email and password fields are editable',async({page})=>{
await page.goto("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
await expect(page.getByPlaceholder("E-Mail Address")).toBeEditable();
await expect(page.getByPlaceholder("Password")).toBeEditable();
});

test('verify alt text in banner image',async({page})=>{
await page.goto("https://ecommerce-playground.lambdatest.io/");
await expect(page.getByAltText("Iphone 11 pro max")).toBeVisible();
});