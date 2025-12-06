import postgres from 'postgres'

const connectionString = "postgresql://postgres.hxksrymblwxgzwoouvip:wRIDryuVL19hi5@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
const sql = postgres(connectionString)

export default sql