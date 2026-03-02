#!/usr/bin/env python3
"""Upload screenshots to Google Drive."""

import os
import json
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCREENSHOT_DIR = Path("/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/eas-guide")
SCREENSHOTS_FOLDER_ID = "1rMyOxeab6FBUDnuW-X2IV_dGLcEnmRJD"
SERVICE_ACCOUNT_KEY = Path("~/.config/google/pawbot-service-account.json").expanduser()

# Load service account credentials
credentials = service_account.Credentials.from_service_account_file(
    str(SERVICE_ACCOUNT_KEY),
    scopes=["https://www.googleapis.com/auth/drive.file"]
)
drive_service = build("drive", "v3", credentials=credentials)

# Get all PNG files
png_files = list(SCREENSHOT_DIR.glob("*.png"))
print(f"Found {len(png_files)} screenshots to upload")

uploaded_files = []

for png_file in sorted(png_files):
    print(f"Uploading: {png_file.name}")
    
    # Create file metadata
    file_metadata = {
        "name": png_file.name,
        "parents": [SCREENSHOTS_FOLDER_ID]
    }
    
    # Upload file
    media = MediaFileUpload(str(png_file), resumable=True)
    file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, name, webViewLink, webContentLink"
    ).execute()
    
    # Make publicly accessible
    drive_service.permissions().create(
        fileId=file["id"],
        body={
            "type": "anyone",
            "role": "reader"
        }
    ).execute()
    
    print(f"  ✓ Uploaded: {file.get('webContentLink')}")
    uploaded_files.append({
        "name": file["name"],
        "id": file["id"],
        "url": f"https://drive.google.com/uc?id={file['id']}"
    })

print(f"\n✅ Uploaded {len(uploaded_files)} files to Google Drive")
print("\nFile IDs and URLs:")
for f in uploaded_files:
    print(f"  {f['name']}: {f['id']} -> {f['url']}")
