const pool = require('../utils/pool.js')

module.exports = class Character {
  id;
  name;
  birthday;
  address;
  elligible;
  img;
  best_gifts;
  about;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.birthday = row.birthday;
    this.address = row.address;
    this.elligible = row.elligible;
    this.img = row.img;
    this.best_gifts = row.best_gifts;
    this.about = row.about;
  }

  static async insert({ name, birthday, address, elligible, img, best_gifts, about }) {
    const { rows } = await pool.query(
      'INSERT INTO characters(name, birthday, address, elligible, img, best_gifts, about) VALUES ($1, $2, $3, $4, $5, ARRAY [$6], $7) RETURNING *',
      [name, birthday, address, elligible, img, best_gifts, about])
    return new Character(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM characters')
    return rows.map((row) => new Character(row))
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM characters WHERE id=$1', [id])

    if (!rows[0]) return null

    return new Character(rows[0])
  }

  static async updateById(id, { name, birthday, address, elligible, img, best_gifts, about }) {
    const result = await pool.query('SELECT * FROM characters WHERE id=$1', [id])

    const existingChar = result.rows[0]

    if(!existingChar) {
      const error = new Error(`Character ${id} not found`)
      error.status = 404
      throw error
    } 

    const { rows } = await pool.query(
      'UPDATE characters SET name=$2, birthday=$3, address=$4, elligible=$5, img=$6, best_gifts=ARRAY [$7], about=$8 WHERE id=$1 RETURNING *', [id, name, birthday, address, elligible, img, best_gifts, about]
    )

    return new Character(rows[0])

  }

  static async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM characters WHERE id=$1 RETURNING *', [id])

    if (!rows[0]) return null;

    return new Character(rows[0])
  }
}