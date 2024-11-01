import re
from playwright.sync_api import Page, expect


def test_example(page: Page) -> None:
    page.goto("https://www.amazon.in/")
    page.get_by_placeholder("Search Amazon.in").click()
    page.get_by_placeholder("Search Amazon.in").fill("iphone 16")
    page.get_by_placeholder("Search Amazon.in").press("Enter")
    page.get_by_label("iphone 16pro max").click()
    expect(page.locator("#search")).to_contain_text("Apple iPhone 16 (128 GB) - Teal")
    page.locator("#a-autoid-10-announce").click()
    expect(page.get_by_role("link", name="Go to Cart")).to_be_visible()
    page.get_by_role("link", name="Go to Cart").click()
    expect(page.locator("#sc-active-44eff442-2830-4cad-8cc9-4137793ba256")).to_contain_text("This will be a giftThis is a gift Learn more")
    page.locator("ul").filter(has_text="Apple iPhone 16 (128 GB) -").locator("i").click()
    expect(page.get_by_label("Proceed to Buy Buy Amazon")).to_be_visible()
    page.get_by_label("Proceed to Buy Buy Amazon").click()
    expect(page.locator("label")).to_contain_text("Email or mobile phone number")
    page.get_by_role("link", name="Amazon", exact=True).click()
    expect(page.locator("#nav-link-accountList-nav-line-1")).to_contain_text("Hello, sign in")
