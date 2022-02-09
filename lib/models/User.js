const pool = require('../utils/pool')

module.exports = class User {
  id;
  role;
  name;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.role = row.role;
    this.name = row.name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ name, role, email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (name, role, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [name, role, email, passwordHash]
    )

    return new User(rows[0])
  } 

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }


  get passwordHash(){
    return this.#passwordHash
  }

  ///////////////////////////////////// new methods above /////////////////////////////////////
}