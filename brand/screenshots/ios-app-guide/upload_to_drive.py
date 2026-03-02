#!/usr/bin/env python3
"""Upload HTML files to Google Drive and make them publicly viewable."""

import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaInMemoryUpload

# Service account key
SERVICE_ACCOUNT_FILE = os.path.expanduser("~/.config/google/pawbot-service-account.json")
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Use "PotLuck App Store Guide" folder
FOLDER_ID = "1occTURCFkbCpF30vXuVP4gKQ3qKC5xLP"

# Source files
SOURCE_DIR = "/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/ios-app-guide"

def get_credentials():
    """Load service account credentials."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return credentials

def create_folder(service, name, parent_id):
    """Create a folder in Google Drive."""
    file_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent_id]
    }
    folder = service.files().create(body=file_metadata, fields='id').execute()
    return folder['id']

def upload_file(service, file_path, folder_id):
    """Upload a file to Google Drive and make it publicly viewable."""
    filename = os.path.basename(file_path)
    
    with open(file_path, 'rb') as f:
        file_content = f.read()
    
    media = MediaInMemoryUpload(file_content, mimetype='text/html')
    
    file_metadata = {
        'name': filename,
        'parents': [folder_id],
        'mimeType': 'text/html'
    }
    
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink, webContentLink'
    ).execute()
    
    # Make the file publicly viewable
    service.permissions().create(
        fileId=file['id'],
        body={
            'type': 'anyone',
            'role': 'reader'
        }
    ).execute()
    
    return file

def main():
    # Authenticate
    credentials = get_credentials()
    service = build('drive', 'v3', credentials=credentials)
    
    # Use the parent folder
    folder_id = FOLDER_ID
    print(f"Using folder ID: {folder_id}")
    
    # Upload files
    files = sorted([f for f in os.listdir(SOURCE_DIR) if f.endswith('.html')])
    uploaded_urls = []
    
    for filename in files:
        file_path = os.path.join(SOURCE_DIR, filename)
        print(f"Uploading: {filename}...")
        
        file = upload_file(service, file_path, folder_id)
        public_url = file.get('webViewLink', '')
        uploaded_urls.append((filename, public_url))
        print(f"  -> Uploaded! URL: {public_url}")
    
    print("\n" + "="*60)
    print("UPLOAD COMPLETE!")
    print("="*60)
    
    # Save URLs to a file for reference
    output_file = os.path.join(SOURCE_DIR, "uploaded_urls.txt")
    with open(output_file, 'w') as f:
        f.write("Uploaded Files:\n")
        f.write("="*60 + "\n")
        for filename, url in uploaded_urls:
            f.write(f"{filename}: {url}\n")
    
    print(f"\nURLs saved to: {output_file}")
    
    # Print summary
    print("\nUploaded files:")
    for filename, url in uploaded_urls:
        print(f"  {filename}")
        print(f"    {url}")

if __name__ == "__main__":
    main()
