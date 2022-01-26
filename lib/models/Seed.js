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
}