import http from 'k6/http';
import { check, sleep } from 'k6';
import { thresholds, BASE_URL } from './options.js';

// Load profile: ramp up to 20 virtual users, hold, then ramp down. The run fails
// if the SLA thresholds in options.js are breached.
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // ramp up
    { duration: '20s', target: 20 }, // steady load
    { duration: '5s', target: 0 }, // ramp down
  ],
  thresholds,
};

export default function () {
  const list = http.get(`${BASE_URL}/api/users`);
  check(list, { 'list 200': (r) => r.status === 200 });

  const one = http.get(`${BASE_URL}/api/users/1`);
  check(one, { 'get one 200': (r) => r.status === 200 });

  const echo = http.post(
    `${BASE_URL}/api/echo`,
    JSON.stringify({ ping: 'pong' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  check(echo, { 'echo 201': (r) => r.status === 201 });

  sleep(1);
}

// Persist the full result so it can be archived or charted downstream.
export function handleSummary(data) {
  return { 'summary.json': JSON.stringify(data, null, 2) };
}
