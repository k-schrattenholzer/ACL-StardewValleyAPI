const pool = require('../utils/pool.js')

module.exports = class Artifact {
  id;
  name;
  abt;
  sell_price;
  img;

  constructor(row){
    this.id = row.id;
    this.name = row.name;
    this.abt = row.abt;
    this.sell_price = row.sell_price;
    this.img = row.img;
  }

  static async insert({  name, abt, sell_price, img }) {
    const { rows } = await pool.query(
      'INSERT INTO artifacts(name, abt, sell_price, img) VALUES ($1, $2, $3, $4) RETURNING *', [name, abt, sell_price, img]
    )
    return new Artifact(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM artifacts')
    return rows.map((row) => new Artifact(row))
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM artifacts WHERE id=$1', [id])

    if (!rows[0]) return null

    return new Artifact(rows[0])
  }

  static async updateById(id, { name, abt, sell_price, img }) {
    const result = await pool.query('SELECT * FROM artifacts WHERE id=$1', [id])

    const existingArtifact = result.rows[0]

    if(!existingArtifact) {
        const error = new Error(`Artifact ${id} not found`)
        error.status = 404
        throw error
    }

    const { rows } = await pool.query(
      'UPDATE artifacts SET name=$2, abt=$3, sell_price=$4, img=$5 WHERE id=$1 RETURNING *',
      [id, name, abt, sell_price, img]
    )

    return new Artifact(rows[0])
  }

  static async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM artifacts WHERE id=$1 RETURNING *', [id])

    if (!rows[0]) return null

    return new Artifact(rows[0])
  }
}