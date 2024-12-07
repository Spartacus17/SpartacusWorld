import pytest
from playwright.sync_api import Page, expect


@pytest.fixture
def setup_teardown(playwright):
    # Launch browser and create a new page instance
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(viewport=None)
    page = context.new_page()
    yield page  # Provide the page to the test
    context.close()  # Close the browser context after the test


def test_amazon_search_add_to_cart_checkout(setup_teardown: Page) -> None:
    page = setup_teardown
    page.goto("https://www.amazon.in/")
    expect(page).to_have_title("Online Shopping site in India: Shop Online for Mobiles, Books, Watches, Shoes and More - Amazon.in")

    search_box = page.get_by_placeholder("Search Amazon.in")
    search_box.click()
    search_box.fill("iphone 16 ultramarine 256 gb")
    page.get_by_role("button", name="Go", exact=True).click()
    expect(page.locator("#search")).to_contain_text("Apple iPhone 16 (256 GB) - Ultramarine")

    # Step 3: Verify "Add to Cart" button is visible and add iPhone to cart
    add_to_cart_button = page.locator("//button[@class='a-button-text'][@id='a-autoid-1-announce']")
    expect(add_to_cart_button).to_be_visible()
    add_to_cart_button.click()

    # Step 4: Go to Cart and verify the "Shopping Cart" page title and text clear
    page.get_by_role("link", name="Go to Cart").click()
    expect(page).to_have_title("Amazon.in Shopping Cart")
    expect(page.locator("#sc-active-cart")).to_contain_text("Shopping Cart")
    page.get_by_role(role="button", name="Proceed to Buy Buy Amazon").click()