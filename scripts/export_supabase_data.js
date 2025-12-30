const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
    try {
        // 1. Read .env
        const envPath = path.join(__dirname, '..', '.env');
        if (!fs.existsSync(envPath)) {
            console.error('.env not found');
            process.exit(1);
        }
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envContent.split(/\r?\n/).forEach(line => {
            const match = line.trim().match(/^([^=]+)=(.*)$/);
            if (match) envVars[match[1].trim()] = match[2].trim();
        });

        const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
        const key = envVars['SUPABASE_SERVICE_ROLE_KEY'];

        if (!url || !key) {
            console.error('Missing Supabase URL or Service Role Key in .env');
            process.exit(1);
        }

        const supabase = createClient(url, key);
        console.log('Connected to Supabase');

        // 2. Define tables to export
        const tables = ['services', 'projects', 'site_settings', 'social_links', 'contact_messages'];
        let sqlOutput = `-- Supabase Data Dump\n-- Generated at ${new Date().toISOString()}\n\n`;

        // 3. Loop through tables
        for (const tableName of tables) {
            console.log(`Exporting table: ${tableName}...`);
            const { data, error } = await supabase.from(tableName).select('*');

            if (error) {
                console.error(`Error fetching ${tableName}:`, error.message);
                sqlOutput += `-- Error fetching table ${tableName}: ${error.message}\n\n`;
                continue;
            }

            if (!data || data.length === 0) {
                sqlOutput += `-- No data for table ${tableName}\n\n`;
                continue;
            }

            // Generate INSERT statements
            // We'll use a single INSERT statement with multiple VALUES for efficiency, or one per row.
            // One per row is safer for large datasets and easier to read.

            sqlOutput += `-- Data for ${tableName}\n`;

            for (const row of data) {
                const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
                const values = Object.values(row).map(val => formatValue(val)).join(', ');
                sqlOutput += `INSERT INTO "public"."${tableName}" (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
            }
            sqlOutput += '\n';
        }

        // 4. Write to file
        const outputPath = path.join(__dirname, '..', 'supabase_dump.sql');
        fs.writeFileSync(outputPath, sqlOutput);
        console.log(`Export completed to ${outputPath}`);

    } catch (e) {
        console.error('Script Error:', e);
    }
}

function formatValue(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (Array.isArray(val)) {
        // Handle arrays text[]
        // e.g. ["a", "b"] -> ARRAY['a', 'b']
        const items = val.map(v => {
            if (typeof v === 'string') return `'${escapeString(v)}'`;
            return v;
        }).join(', ');
        return `ARRAY[${items}]`;
    }
    if (typeof val === 'object') {
        // JSON object
        return `'${escapeString(JSON.stringify(val))}'`;
    }
    // String
    return `'${escapeString(val)}'`;
}

function escapeString(str) {
    return str.replace(/'/g, "''");
}

main();
