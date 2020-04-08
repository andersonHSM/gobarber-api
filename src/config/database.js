module.exports = {
  dialect: 'postgres',
  host: 'db',
  username: 'postgres',
  password: '123',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
