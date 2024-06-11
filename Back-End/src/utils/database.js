const { createClient, SupabaseClient } = require('@supabase/supabase-js');

/**
 * 
 * @returns {SupabaseClient<any, "public", any>}
 */
module.exports = () => {
    let connection = null;
    if(!connection) {
        connection = createClient(process.env.URL, process.env.KEY);
        return connection;
    }
    return connection;
}