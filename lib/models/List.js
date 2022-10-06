const pool = require('../utils/pool');

module.exports = class List {
  id;
  description;
  completed;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.completed = row.completed;
  }

  static async insert({ description, completed }) {
    const { rows } = await pool.query(
      `INSERT INTO lists (description, completed)
        VALUES ($1, $2)
        RETURNING *
        `,
      [description, completed]
    );

    return new List(rows[0]);
  }

};
