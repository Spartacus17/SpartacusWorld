import { test, expect } from '@playwright/test';

test.describe.serial('Sequential Test Suite', () => {
    let isLoggedIn = false;
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        });

    async function login(page){
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const password = process.env.SAUCEDEMO_PASSWORD;
        await page.goto('https://www.saucedemo.com/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill(password);
        await page.locator('//input[@id="login-button"]').click();
        console.log('Checking if the user has logged in and the Products page has loaded...');
        await expect(page.locator('//span[contains(text(),"Products")]')).toHaveText('Products');
        isLoggedIn = true; // Set login flag
    }


    test('completed login', async ({ page }) => {
        await login (page);
        });
       

    test('verify price sorting dropdown options', async ({ page }) => {
        await login(page);
        console.log('Checking for all dropdown options available for sorting..');
        const dropdown = page.locator('//select[@class="product_sort_container"]');
        const options = dropdown.locator('option');

        // Assert the number of dropdown options
        await expect(options).toHaveCount(4);
        console.log('Printing all the 4 dropdown options of sorting');
        const optionCount = await options.count();
        for (let i = 0; i < optionCount; i++) {
            const optionText = await options.nth(i).textContent();
            console.log(`Option ${i + 1}: ${optionText}`);
        }

        // Assert dropdown options by their text or value
        await expect(options.nth(0)).toHaveText('Name (A to Z)');
        await expect(options.nth(1)).toHaveText('Name (Z to A)');
        await expect(options.nth(2)).toHaveText('Price (low to high)');
        await expect(options.nth(3)).toHaveText('Price (high to low)');
    });
    test('check sorting of items', async ({page})=>{
        await login(page);
        const priceElements = page.locator('//div[@class="inventory_item_price"]');
        const originalPrices = await priceElements.allTextContents();
        console.log('Original Prices',originalPrices);
         // Step 2: Sort the original prices list (expected sorted list)
         const sortedPrices = [...originalPrices].sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')));
         console.log('Expected Sorted Prices:', sortedPrices);
         //click on the price sorted dropdown and select price:low to high option
         const dropdown = page.locator('//select[@class="product_sort_container"]');
         await dropdown.selectOption({value:'lohi'});

         const newPriceElements = page.locator('//div[@class="inventory_item_price"]');
         const newPrices = await newPriceElements.allTextContents();
         console.log('New prices after sorting:',newPrices);

         //compare the prices pre and post sorting
         expect(newPrices).toEqual(sortedPrices);
        });

    test('add to cart and checkout', async({page})=>{
        await login(page);
        await page.locator('//button[@name="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('//button[@name="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('//button[@name="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        //cart count increases to '3'
        await expect(page.locator('//span[@class="shopping_cart_badge"][text()="3"]')).toHaveText('3');
        await page.locator('//a[@class="shopping_cart_link"]').click();
        await expect(page.locator('//span[@class="title"][text()="Your Cart"]')).toHaveText('Your Cart');
        await page.getByRole("button",{name:'checkout'}).click();
        await expect(page.locator('//span[@data-test="title"][text()="Checkout: Your Information"]')).toHaveText('Checkout: Your Information');
        await page.getByPlaceholder('First Name').fill('Chirag');
        await page.getByPlaceholder('Last Name').fill('Dwivedi');
        await page.getByPlaceholder('Zip/Postal Code').fill('560027');
        await page.getByRole("button",{name:"continue"}).click();
        await expect(page.locator('//div[@class="summary_info_label"][text()="Price Total"]')).toHaveText('Price Total');
        await page.getByRole("button", {name:'Finish'}).click();
        await expect(page.locator('//h2[@class="complete-header"][text()="Thank you for your order!"]')).toHaveText('Thank you for your order!');
        await page.getByRole("button",{name:'Back Home'}).click();
    })

    test.afterEach(async ({ page }) => {
        try {
            if (isLoggedIn) {
                console.log('Logging out and cleaning up...');
                await page.locator('//button[contains(text(),"Open Menu")]').click();
                await page.locator('//a[@id="logout_sidebar_link"]').click();
                isLoggedIn = false; // Reset login status
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
     });
});