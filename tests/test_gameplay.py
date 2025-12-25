
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def solve_question(question_text):
    """
    Parses question text like '5 + 3 = ?' and returns the result.
    """
    # Remove ' = ?'
    expression = question_text.replace(' = ?', '')
    parts = expression.split()
    num1 = int(parts[0])
    operator = parts[1]
    num2 = int(parts[2])
    
    if operator == '+':
        return num1 + num2
    elif operator == '-':
        return num1 - num2
    else:
        raise ValueError(f"Unknown operator: {operator}")

def test_correct_answer_flow(driver, base_url):
    driver.get(base_url)
    
    # Get the question
    question_elem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "question"))
    )
    question_text = question_elem.text
    correct_val = solve_question(question_text)
    
    # Find the correct button
    buttons = driver.find_elements(By.CSS_SELECTOR, "#answer-buttons .btn")
    correct_btn = None
    for btn in buttons:
        if int(btn.text) == correct_val:
            correct_btn = btn
            break
            
    assert correct_btn is not None, f"Could not find button with answer {correct_val}"
    
    # Click it
    correct_btn.click()
    
    # Verify feedback
    feedback_elem = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "feedback"))
    )
    assert feedback_elem.text == "Correct!", f"Expected 'Correct!' but got '{feedback_elem.text}'"
    
    # Verify score updated to 1/1
    score_counter = driver.find_element(By.ID, "score-counter")
    assert score_counter.text == "Score: 1/1", f"Expected 'Score: 1/1' but got '{score_counter.text}'"


def test_incorrect_answer_flow(driver, base_url):
    driver.get(base_url)
    
    # Get the question
    question_elem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "question"))
    )
    question_text = question_elem.text
    correct_val = solve_question(question_text)
    
    # Find an incorrect button
    buttons = driver.find_elements(By.CSS_SELECTOR, "#answer-buttons .btn")
    incorrect_btn = None
    for btn in buttons:
        if int(btn.text) != correct_val:
            incorrect_btn = btn
            break
            
    assert incorrect_btn is not None, "Could not find an incorrect answer button"
    
    # Click it
    incorrect_btn.click()
    
    # Verify feedback
    feedback_elem = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "feedback"))
    )
    assert feedback_elem.text == "Incorrect. Try again!", \
        f"Expected 'Incorrect. Try again!' but got '{feedback_elem.text}'"
    
    # Verify score updated to 0/1 (since it counts attempts/questions)
    # Based on app logic: totalQuestions increments on every answer check.
    # correctCount only increments on correct answer.
    # So if we answer wrong, it is 0/1.
    score_counter = driver.find_element(By.ID, "score-counter")
    assert score_counter.text == "Score: 0/1", f"Expected 'Score: 0/1' but got '{score_counter.text}'"
