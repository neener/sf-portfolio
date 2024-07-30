import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6ti8vhaw', 
  dataset: 'production', 
  apiVersion: '2023-07-24', 
  useCdn: false, // `false` if you want to ensure fresh data
});

export default client;