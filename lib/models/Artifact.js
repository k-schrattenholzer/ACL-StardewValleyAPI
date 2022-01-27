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
    return new Seed(rows[0])
  }
}