
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def pytest_addoption(parser):
    parser.addoption(
        "--base-url", 
        action="store", 
        default="http://localhost:8000", 
        help="Base URL for the application under test"
    )

@pytest.fixture
def base_url(request):
    return request.config.getoption("--base-url")

@pytest.fixture
def driver():
    options = Options()
    # options.add_argument("--headless")  # Uncomment to run headless
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()
