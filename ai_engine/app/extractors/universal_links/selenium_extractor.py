from selenium import webdriver
from selenium.webdriver.common.by import By
from urllib.parse import urljoin

def extract_selenium_links(url: str) -> set[str]:
    driver = webdriver.Chrome()
    driver.get(url)

    links = set()
    for a in driver.find_elements(By.TAG_NAME, "a"):
        href = a.get_attribute("href")
        if href:
            links.add(urljoin(url, href))

    driver.quit()
    return links
