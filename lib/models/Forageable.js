const pool = require('../utils/pool.js')

module.exports = class Forageable {
  id;
  name;
  abt;
  where_tofind;
  img;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.abt = row.abt;
    this.where_tofind = row.where_tofind;
    this.img = row.img;
  }

  static async insert({ name, abt, where_tofind, img }) {
    const { rows } = await pool.query(
      'INSERT INTO forageables(name, abt, where_tofind, img) VALUES ($1, $2, ARRAY [$3], $4) RETURNING *',
      [name, abt, where_tofind, img])
    return new Forageable(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM forageables')
    return rows.map((row) => new Forageable(row))
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM forageables WHERE id=$1', [id])

    if (!rows[0]) return null

    return new Forageable(rows[0])
  }

  static async updateById(id, { name, birthday, address, elligible, img, best_gifts, about }) {
    const result = await pool.query('SELECT * FROM forageables WHERE id=$1', [id])

    const existingChar = result.rows[0]

    if(!existingChar) {
      const error = new Error(`Forageable ${id} not found`)
      error.status = 404
      throw error
    } 

    const { rows } = await pool.query(
      'UPDATE forageables SET name=$2, birthday=$3, address=$4, elligible=$5, img=$6, best_gifts=ARRAY [$7], about=$8 WHERE id=$1 RETURNING *',
      [id, name, birthday, address, elligible, img, best_gifts, about]
    )

    return new Forageable(rows[0])
  }

  static async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM forageables WHERE id=$1 RETURNING *', [id])

    if (!rows[0]) return null

    return new Forageable(rows[0])
  }
}