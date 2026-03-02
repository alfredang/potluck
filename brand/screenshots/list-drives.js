const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/orin_nano/.config/google/pawbot-service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

async function main() {
  // Check for shared drives
  const response = await drive.drives.list({
    pageSize: 20,
  });
  
  console.log('Shared Drives:', JSON.stringify(response.data.drives, null, 2));
}

main().catch(console.error);
