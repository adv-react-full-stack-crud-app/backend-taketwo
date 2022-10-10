const pool = require('../utils/pool');

module.exports = class List {
  id;
  description;
  completed;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.completed = row.completed;
    this.user_id = row.user_id;
  }

  static async insert({ description, completed, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO lists (description, completed, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [description, completed, user_id]
    );

    return new List(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM lists
      WHERE user_id = $1
      `,
      [user_id]
    );
    return rows.map((row) => new List(row));
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM lists
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    return new List(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM lists
      WHERE id = $1
      `,
      [id]
    );
    return new List(rows[0]);
  }

  static async update(id, attr) {
    const list = await List.getById(id);
    if (!list) return null;
    const { completed } = { ...list, ...attr };
    const { rows } = await pool.query(
      `
      UPDATE lists
      SET completed=$2
      WHERE id=$1
      RETURNING *
    `,
      [id, completed]
    );
    return new List(rows[0]);
  }
};
