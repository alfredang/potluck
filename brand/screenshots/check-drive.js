const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/orin_nano/.config/google/pawbot-service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

async function main() {
  // First try to find the folder
  const response = await drive.files.list({
    q: "name='Screenshots' and mimeType='application/vnd.google-apps.folder'",
    fields: 'files(id, name)',
  });
  
  console.log('Found folders:', JSON.stringify(response.data.files, null, 2));
  
  // Also check root
  const rootResponse = await drive.files.list({
    pageSize: 20,
    fields: 'files(id, name, mimeType)',
  });
  
  console.log('\nRoot files:', JSON.stringify(rootResponse.data.files, null, 2));
}

main().catch(console.error);
