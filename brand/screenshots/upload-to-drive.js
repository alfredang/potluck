const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/appstore-guide';
const PARENT_FOLDER_ID = '1rMyOxeab6FBUDnuW-X2IV_dGLcEnmRJD';

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/orin_nano/.config/google/pawbot-service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

async function uploadAndShare(filePath, filename) {
  try {
    const fileMetadata = {
      name: filename,
      parents: [PARENT_FOLDER_ID],
    };

    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true,
    });

    const fileId = file.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: 'anyone',
        role: 'reader',
      },
      supportsAllDrives: true,
    });

    const directLink = `https://drive.google.com/uc?id=${fileId}`;
    console.log(`Uploaded: ${filename} -> ${directLink}`);
    
    return { filename, fileId, directLink };
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  
  const results = [];
  for (const file of files) {
    const filePath = path.join(SCREENSHOT_DIR, file);
    const result = await uploadAndShare(filePath, file);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n--- Results ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
