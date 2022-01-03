import Pool from "pg-pool";
const pool = new Pool({
    database: "postgres",
    user: "postgres",
    password: "example",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 1000, // Close idle clients after 1 second
});
export const executeQuery = (text, values) => {
    return pool.query(text, values);
};
