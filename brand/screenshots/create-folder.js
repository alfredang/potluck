const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/orin_nano/.config/google/pawbot-service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

async function main() {
  // Search for "Paw (Coding)" folder
  const response = await drive.files.list({
    q: "name contains 'Paw' or name contains 'Coding'",
    fields: 'files(id, name, mimeType)',
  });
  
  console.log('Found:', JSON.stringify(response.data.files, null, 2));
  
  // Create a new folder if not found
  if (response.data.files.length === 0) {
    const folderMetadata = {
      name: 'PotLuck App Store Guide',
      mimeType: 'application/vnd.google-apps.folder',
    };
    
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id, name',
    });
    
    console.log('\nCreated folder:', JSON.stringify(folder.data, null, 2));
  }
}

main().catch(console.error);
