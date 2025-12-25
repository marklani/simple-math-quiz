
from selenium.webdriver.common.by import By

def test_initial_load_state(driver, base_url):
    driver.get(base_url)
    
    # Verify 1-digit level is selected by default
    level_one_btn = driver.find_element(By.CSS_SELECTOR, '.level-btn[data-digits="1"]')
    assert "active-level" in level_one_btn.get_attribute("class"), \
        "1-Digit button should be selected by default (have 'active-level' class)"

    # Verify initial score is 0/0
    score_counter = driver.find_element(By.ID, "score-counter")
    assert score_counter.text == "Score: 0/0", \
        f"Expected 'Score: 0/0' but got '{score_counter.text}'"
