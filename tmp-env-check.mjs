import { config } from 'dotenv'
config({ path: new URL('./.env.local', import.meta.url).pathname })
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('type:', typeof process.env.DATABASE_URL)
