
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("db.json");
const defaultData = { users: [], events: [] };
const db = new Low(adapter, defaultData);

await db.read();

export default db;
