import requests
import os
import re

# The URL of the bucket
BUCKET_URL = "https://gptwrapped-data.husaria.dev/"

def get_file_list():
    response = requests.get(BUCKET_URL)
    if response.status_code == 200:
        content = response.text
        # Use regex to find all JSON file URLs
        pattern = r'href="([^"]+\.json)"'
        files = re.findall(pattern, content)
        return files
    else:
        print(f"Failed to fetch file list. Status code: {response.status_code}")
        return []

def download_file(url):
    filename = url.split('/')[-1]
    full_url = BUCKET_URL + url if not url.startswith('http') else url
    response = requests.get(full_url)
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

    # Download files
    for file in files:
        download_file(file)

    print("Download completed.")

if __name__ == "__main__":
    main()