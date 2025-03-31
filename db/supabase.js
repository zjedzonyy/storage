const { createClient } = require("@supabase/supabase-js");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

// SUPABASE CONFIG
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error("Missing KEY in .env");
}
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = { supabase, supabaseUrl };
