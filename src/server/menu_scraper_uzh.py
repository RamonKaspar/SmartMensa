import requests
from bs4 import BeautifulSoup
from time import sleep
import json
import os
import re

def getXMLData(url, day):
    # Fetch the webpage content
    response = requests.get(url)
    if response.status_code == 200:
        print(f'{"STATUS:":<15} Page of {day} successfully accessed!')
        return response.content
    else:
        print("Failed to fetch the webpage.")
        return None

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
                            'students': float(prices[0].replace('CHF', '').replace('|', '').strip()) if (len(prices) >= 1 and prices != ['']) else "",
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
                        current_item['allergens'] = []
                    else:
                        allergens = item.text.strip().split('<br/>')
                        allergens = [allergen.strip() for allergen in allergens if allergen.strip()]
                        if allergens:
                            current_item['allergens'] = allergens

            if current_item:
                menu_info[day_time].append(current_item)

        menus.append(menu_info)

    # Post-processing the data

    # Function to process allergens
    def process_allergens(allergens):
        if allergens == "":
            return []
        prefix_en = "Allergy information:"
        prefix_de = "Allergikerinformationen:"
        cleaned_allergens = [allergen.strip() for allergen in allergens.split(',') if allergen.strip() != prefix_en and allergen.strip() != prefix_de]
        cleaned_allergens[0] = re.sub(r'(?<=\n)\s+', '', cleaned_allergens[0])
        cleaned_allergens[0] = cleaned_allergens[0].replace("Allergy information:\n", "")
        cleaned_allergens[0] = cleaned_allergens[0].replace("Allergikerinformationen:\n", "")
        return cleaned_allergens

    # Update allergens in the JSON data
    for section in menus:
        for item in section[day_time]:
            if "allergens" in item:
                allergens = item["allergens"][0] if len(item["allergens"]) > 0 else ""
                item["allergens"] = process_allergens(allergens)

    # Function to clean up the meal descriptions
    def clean_meal_descriptions(data):
        for item in data[0][day_time]:
            # Use regular expression to replace whitespace after \n
            item['meal_description'] = re.sub(r'(\n)\s+', r'\1', item['meal_description'])
            # Use regular expression to replace whitespace before \n
            item['meal_description'] = re.sub(r'\s+(\n)', r'\1', item['meal_description'])
            # Use regular expression to replace \n if the word after \n is "mit" or "with" or "," or ", " or "und" or "and" or "in" or "im" or "&"
            item['meal_description'] = re.sub(r'(\n)(mit|with|,|, |und|and|in|im|&)', r' \2', item['meal_description'])
            # Reverse meal_description
            item['meal_description'] = item['meal_description'][::-1]
            # Use regular expression to replace \n if the word after \n is "," or " ," or "tim"
            item['meal_description'] = re.sub(r'(\n)(,| ,|tim)', r' \2', item['meal_description'])
            # Reverse meal_description
            item['meal_description'] = item['meal_description'][::-1]
            # Use regular expression to replace \n with " | "
            item['meal_description'] = re.sub(r'(\n)', r' | ', item['meal_description'])
            
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

##############################################################################################################################

# Generate the URL for the current week for each facility

def generate_url(facility_id, week_day, language):
    return f'https://zfv.ch/{language}/menus/rssMenuPlan?menuId={facility_id}&type=uzh2&dayOfWeek={week_day}'

##############################################################################################################################

def main():
    # Define the facility IDs for the different ETHZ facilities, for more information see facility-ids.md
    # facility_ids_english = [
    #                 505, 506, 507, 508, 509, 520,  # Zentrum (UZH)
    #                 180, 512, 513, 514,            # Irchel
    #                 515, 516, 517, 518, 519, 520   # Other

    facility_ids_german = [142, 143, 144, 146, 147, 148, 149, 150, 151, 184, 241, 256, 346, 391] # 176 removed (Irchel Atrium Mensa closed)
    language = "de"

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    for facility_id in facility_ids_german:
        print(f'{ "FACILITY ID:":<15} Processing facility {facility_id}...')
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
            url = generate_url(facility_id, days.index(day)+1, language)
            xml_data = getXMLData(url, day)
            day_time = "Dinner" if (facility_id == 506 or facility_id == 514 or facility_id == 149 or facility_id == 256) else "Lunch"
            json_data = parseXMLToJSON(xml_data, day_time)
            facility_menus[day][day_time].extend(json_data[0][day_time])
            sleep(1)
        
        print(f'{"STATUS:":<15} Menus of facility {facility_id} successfully crawled!')
        json_data_string = convertToJsonString(facility_menus)
        directory = 'menus-as-json'
        saveJSON(json_data_string, directory, facility_id)
        sleep(1)
    
    print(f'{"STATUS:":<15} All UZH menus successfully stored!')

if __name__ == "__main__":
    main()
