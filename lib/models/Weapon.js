const pool = require('../utils/pool.js')

module.exports = class Weapon {
  id;
  type;
  name;
  level;
  abt;
  damage;
  img;

  constructor (row) {
    this.id = row.id;
    this.type = row.type,
    this.name = row.name, 
    this.level = row.level,
    this.abt = row.abt,
    this.damage = row.damage,
    this.img = row.img
  }

  static async insert({  type, name, level, abt, damage, img }) {
    const { rows } = await pool.query(
      'INSERT INTO weapons(type, name, level, abt, damage, img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [type, name, level, abt, damage, img ]
    )
    return new Weapon(rows[0])
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM weapons')
    return rows.map((row) => new Weapon(row))
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM weapons WHERE id=$1', [id])

    if (!rows[0]) return null

    return new Weapon(rows[0])
  }

  static async updateById(id, { type, name, level, abt, damage, img }) {
    const result = await pool.query('SELECT * FROM weapons WHERE id=$1', [id])

    const existingWeapon = result.rows[0]

    if(!existingWeapon) {
        const error = new Error(`Weapon ${id} not found`)
        error.status = 404
        throw error
    }

    const { rows } = await pool.query(
      'UPDATE weapons SET type=$2, name=$3, level=$4, abt=$5, damage=$6, img=$7 WHERE id=$1 RETURNING *',
      [id, type, name, level, abt, damage, img]
    )

    return new Weapon(rows[0])
  }

  static async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM weapons WHERE id=$1 RETURNING *', [id])

    if (!rows[0]) return null

    return new Weapon(rows[0])
  }
}