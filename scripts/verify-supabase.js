const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Read .env file manually
        const envPath = path.join(__dirname, '..', '.env');
        console.log('Reading .env from:', envPath);

        if (!fs.existsSync(envPath)) {
            console.error('.env file not found!');
            process.exit(1);
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};

        console.log('Parsing .env content...');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) return;

            const match = trimmedLine.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                envVars[key] = value;
                // console.log(`Parsed: ${key}`); // Don't log values for security
            }
        });

        const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
        const key = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

        if (!url || !key) {
            console.error('Missing Supabase credentials in .env');
            console.log('Found keys:', Object.keys(envVars));
            process.exit(1);
        }

        console.log('Testing connection to:', url);

        // Supabase REST API endpoint
        const restUrl = `${url}/rest/v1/site_settings?select=count&limit=1`;

        const response = await fetch(restUrl, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        if (!response.ok) {
            console.error('Connection Failed:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
            process.exit(1);
        } else {
            console.log('Connection Successful! (Status: ' + response.status + ')');
            const data = await response.json();
            console.log('Data received:', data);
        }

    } catch (e) {
        console.error('Script Error:', e.message);
    }
}

main();
