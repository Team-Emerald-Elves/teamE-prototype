import { createSupabaseForRequest } from "../lib/supabase";

async function main() {
  const supabase = createSupabaseForRequest()
  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  return data;
}

main()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("Error listing buckets from Supabase storage.", err);
  });