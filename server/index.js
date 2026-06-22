const express = require('express');

/**
 * A small bundled target service so the load tests are hermetic - they run the
 * same locally and in CI without depending on an external environment.
 */
const app = express();
app.use(express.json());

const users = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Alan Turing' },
];

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/users', (req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json(user);
});
app.post('/api/echo', (req, res) => res.status(201).json({ received: req.body || {} }));

const PORT = process.env.PORT || 5050;
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Target service on http://localhost:${PORT}`);
  });
}

module.exports = app;
