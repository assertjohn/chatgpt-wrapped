import requests
import os
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

# Replace with your actual bucket URL
BUCKET_URL = "https://gptwrapped-data.husaria.dev/"

def get_file_list():
    response = requests.get(f"{BUCKET_URL}")
    if response.status_code == 200:
        content = response.text
        # Use regex to find all JSON file URLs
        pattern = r'href="(https://[^"]+\.json)"'
        files = re.findall(pattern, content)
        return files
    else:
        print(f"Failed to fetch file list. Status code: {response.status_code}")
        return []

def download_file(url):
    filename = url.split('/')[-1]
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
    else:
        print(f"Failed to download {filename}. Status code: {response.status_code}")

def main():
    files = get_file_list()
    if not files:
        print("No files found to download.")
        return

    print(f"Found {len(files)} JSON files to download.")

    # Create a directory to store the downloaded files
    os.makedirs("downloaded_jsons", exist_ok=True)
    os.chdir("downloaded_jsons")

    # Download files using multiple threads
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(download_file, url): url for url in files}
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                future.result()
            except Exception as exc:
                print(f'{url} generated an exception: {exc}')

    print("Download completed.")

    # Combine all JSON files into one
    combined_data = []
    for filename in os.listdir():
        if filename.endswith('.json'):
            with open(filename, 'r') as f:
                try:
                    data = json.load(f)
                    combined_data.append(data)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON from {filename}")

    with open('../combined_data.json', 'w') as f:
        json.dump(combined_data, f, indent=2)

    print("All JSON files have been combined into 'combined_data.json'")

if __name__ == "__main__":
    main()