const pool = require('../utils/pool.js')

module.exports = class Seed {
  id;
  name;
  crop;
  abt;
  sell_price;
  img;

  constructor(row){
    this.id = row.id;
    this.name = row.name;
    this.crop = row.crop;
    this.abt = row.abt;
    this.sell_price = row.sell_price;
    this.img = row.img;
  }

  static async insert({  name, crop, abt, sell_price, img }) {
    const { rows } = await pool.query(
      'INSERT INTO seeds(name, crop, abt, sell_price, img) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, crop, abt, sell_price, img]
    )
    return new Seed(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM seeds')
    return rows.map((row) => new Seed(row))
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM seeds WHERE id=$1', [id])

    if (!rows[0]) return null

    return new Seed(rows[0])
  }

  static async updateById(id, { name, crop, abt, sell_price, img }) {
    const result = await pool.query('SELECT * FROM seeds WHERE id=$1', [id])

    const existingSeed = result.rows[0]

    if(!existingSeed) {
        const error = new Error(`Seed ${id} not found`)
        error.status = 404
        throw error
    }

    const { rows } = await pool.query(
      'UPDATE seeds SET name=$2, crop=$3, abt=$4, sell_price=$5, img=$6 WHERE id=$1 RETURNING *',
      [id, name, crop, abt, sell_price, img]
    )

    return new Seed(rows[0])
  }

  static async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM seeds WHERE id=$1 RETURNING *', [id])

    if (!rows[0]) return null

    return new Seed(rows[0])
  }
}