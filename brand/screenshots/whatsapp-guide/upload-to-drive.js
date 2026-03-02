const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = '/home/orin_nano/.openclaw/workspace/potluck/brand/screenshots/whatsapp-guide';
const SERVICE_ACCOUNT_KEY = '/home/orin_nano/.config/google/pawbot-service-account.json';

// Create folder in root (we'll find an existing one or create a new one)
async function uploadScreenshots() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  // Find or create a Screenshots folder in root
  const folderName = 'WhatsApp Guide Screenshots';
  const folderQuery = `name='${folderName}' and trashed=false`;
  
  let folderId;
  const folderResponse = await drive.files.list({ q: folderQuery, fields: 'files(id, name)' });
  
  if (folderResponse.data.files.length > 0) {
    folderId = folderResponse.data.files[0].id;
    console.log(`Using existing folder: ${folderName} (ID: ${folderId})`);
  } else {
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const folder = await drive.files.create({ resource: folderMetadata, fields: 'id' });
    folderId = folder.data.id;
    console.log(`Created new folder: ${folderName} (ID: ${folderId})`);
  }

  // Get all PNG files
  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(SCREENSHOT_DIR, file);
    const fileName = file;
    
    console.log(`Uploading: ${fileName}...`);
    
    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };
    
    const metadata = {
      name: fileName,
      parents: [folderId],
    };
    
    const uploadedFile = await drive.files.create({
      resource: metadata,
      media: media,
      fields: 'id, name, webViewLink',
    });
    
    const fileId = uploadedFile.data.id;
    
    // Make publicly viewable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: 'anyone',
        role: 'reader',
      },
    });
    
    const results2 = await drive.files.get({
      fileId: fileId,
      fields: 'id, webContentLink',
    });
    
    const publicLink = `https://drive.google.com/uc?id=${fileId}`;
    console.log(`  → Public URL: ${publicLink}`);
    
    results.push({ fileName, fileId, publicLink });
  }
  
  console.log('\n=== All Uploads Complete ===');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
}

uploadScreenshots().catch(console.error);
