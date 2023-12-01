from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from fake_useragent import UserAgent
from bs4 import BeautifulSoup
from time import sleep
import json
import os
import re

# Set up Selenium webdriver

chrome_options = Options()
chrome_options.binary_location = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
chrome_options.add_argument("--headless")  # Run in headless mode (without opening browser window)
chrome_options.add_argument('--disable-blink-features=AutomationControlled')
# Set the path for the ChromeDriver
chrome_driver_path = '/opt/homebrew/bin/chromedriver'

# Set up fake user agent
ua = UserAgent()

# Set up service
service = Service(chrome_driver_path)

# Create a Chrome webdriver instance
driver = webdriver.Chrome(service=service, options=chrome_options)

# Set waiting time for webdriver
wait = WebDriverWait(driver, 10)

##############################################################################################################################

# Get the XML data to parse from the page using Selenium

def getXMLData(url):
    # Open the webpage
    driver.get(url)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, 'pre')))
    print(f'{"STATUS:":<15} Page successfully accessed!')

    # Parse the data to a dictionary using Pydantic models
    xml_data = driver.find_element(By.TAG_NAME, 'pre').text

    print(f'{"STATUS:":<15} Page source successfully parsed!')
    print("")

    return xml_data

##############################################################################################################################

# Parse the XML to a JSON string

def parseXMLToJSON(xml_data, day_time):
    soup = BeautifulSoup(xml_data, 'xml')

    # Find all entries
    entries = soup.find_all('entry')

    menus = []
    for entry in entries:
        menu_info = {}
        menu_info['title'] = entry.find('title').text

        # Extracting menu details
        summary = entry.find('summary')
        if summary:
            menu_info[day_time] = []
            items = summary.find_all(['h3', 'p', 'table', 'p'])
            current_item = {}
            for item in items:
                if item.name == 'h3':
                    if current_item:
                        menu_info[day_time].append(current_item)
                    # Extracting price information and cleaning the name
                    name_text = item.text.strip()
                    price_span = item.find('span', class_='price')
                    if price_span:
                        prices = price_span.text.strip().split('/')
                        prices = [price.strip() for price in prices]
                        price_info = {
                            'students': float(prices[0].replace('CHF', '').replace('|', '').strip()) if len(prices) >= 1 else "",
                            'internal': float(prices[1].strip()) if len(prices) >= 2 else "",
                            'external': float(prices[2].strip()) if len(prices) >= 3 else ""
                        }
                        current_item = {
                            'line_name': name_text.split('|')[0].strip(),
                            'price_info': price_info
                        }
                elif item.name == 'p':
                    if current_item and 'meal_description' not in current_item:
                        current_item['meal_description'] = item.text.strip()
                    else:
                        allergens = item.text.strip().split('<br/>')
                        allergens = [allergen.strip() for allergen in allergens if allergen.strip()]
                        if allergens:
                            current_item['allergens'] = allergens
                elif item.name == 'table':
                    nutrition = {}
                    rows = item.find_all('tr')
                    for row in rows:
                        columns = row.find_all('td')
                        if len(columns) == 2:
                            nutrition[columns[0].text.strip()] = columns[1].text.strip()
                    current_item['nutrition'] = nutrition

            if current_item:
                menu_info[day_time].append(current_item)

        menus.append(menu_info)

    # Post-processing the data

    # Function to process allergens
    def process_allergens(allergens):
        prefix = "Allergy information:"
        cleaned_allergens = [allergen.strip() for allergen in allergens.split(',') if allergen.strip() != prefix]
        cleaned_allergens[0] = re.sub(r'(?<=\n)\s+', '', cleaned_allergens[0])
        cleaned_allergens[0] = cleaned_allergens[0].replace("Allergy information:\n", "")
        return cleaned_allergens

    # Update allergens in the JSON data
    for section in menus:
        for item in section[day_time]:
            if "allergens" in item:
                allergens = item["allergens"][0]
                item["allergens"] = process_allergens(allergens)

    # Function to clean up the meal descriptions
    def clean_meal_descriptions(data):
        for item in data[0][day_time]:
            # Use regular expression to replace whitespace after \n
            item['meal_description'] = re.sub(r'(\n)\s+', r'\1', item['meal_description'])

    # Clean the meal descriptions
    clean_meal_descriptions(menus)

    return menus

##############################################################################################################################

# Convert the JSON data to a JSON string

def convertToJsonString(data):
    return json.dumps(data, indent=4, ensure_ascii=False)

##############################################################################################################################

# Save the JSON data to a file

def saveJSON(json_data_string, directory, facility_id):
    # Create a directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Path to the file in the subfolder
    file_path = os.path.join(directory, f'menus-facility-{facility_id}.json')

    # Save JSON data to a json file using utf-8 encoding
    with open(file_path, 'w', encoding='utf-8') as json_file:
        json_file.write(json_data_string)

    print(f'{"STATUS:":<15} menus-facility-{facility_id}.json successfully stored!')
    print("")

##############################################################################################################################

def main():
    # Generate the URL for the current week for each facility
    def generate_url(facility_id, week_day):
        return f'https://zfv.ch/en/menus/rssMenuPlan?menuId={facility_id}&type=uzh2&dayOfWeek={week_day}'
    
    # Define the facility IDs for the different ETHZ facilities, for more information see facility-ids.md
    facility_ids = [
                    505, 506, 507, 508, 509, 520,  # Zentrum (UZH)
                    180, 512, 513, 514,            # Irchel
                    515, 516, 517, 518, 519, 520   # Other
                    ]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    for facility_id in facility_ids:
        facility_menus = {
                        "Monday": {"Lunch": [], "Dinner": []},
                        "Tuesday": {"Lunch": [], "Dinner": []},
                        "Wednesday": {"Lunch": [], "Dinner": []},
                        "Thursday": {"Lunch": [], "Dinner": []},
                        "Friday": {"Lunch": [], "Dinner": []},
                        "Saturday": {"Lunch": [], "Dinner": []},
                        "Sunday": {"Lunch": [], "Dinner": []}
                        }
        for day in days:
            user_agent = ua.random
            print(f'{"USER AGENT:":<15} {user_agent}')
            chrome_options.add_argument(f'--user-agent={user_agent}')

            print(f'{ "FACILITY ID:":<15} Processing {day} of facility {facility_id}...')
            url = generate_url(facility_id, days.index(day)+1)
            xml_data = getXMLData(url)
            day_time = "Dinner" if (facility_id == 506 or facility_id == 514) else "Lunch"
            json_data = parseXMLToJSON(xml_data, day_time)
            facility_menus[day][day_time].extend(json_data[0][day_time])
            sleep(1)
        
        json_data_string = convertToJsonString(facility_menus)
        directory = 'menus-as-json'
        saveJSON(json_data_string, directory, facility_id)
        sleep(1)
    
    print(f'{"STATUS:":<15} All menus successfully stored!')

if __name__ == "__main__":
    main()
    driver.quit()
