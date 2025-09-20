const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log('🔍 Checking Supabase connection...');

    // Query to get all tables in the public schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('❌ Error querying tables:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('\n📋 Tables in your Supabase database:');
      console.log('=====================================');
      data.forEach((table) => {
        console.log(`• ${table.table_name} (${table.table_type})`);
      });
      console.log(`\nTotal: ${data.length} tables found`);
    } else {
      console.log('📭 No tables found in the public schema');
      console.log(
        '💡 You may need to create tables first using the schema.sql file'
      );
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\n💡 Make sure to:');
    console.log(
      '1. Set your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
    );
    console.log('2. Check your Supabase project is active');
    console.log('3. Verify your credentials are correct');
  }
}

listTables();
