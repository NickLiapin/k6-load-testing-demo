import http from 'k6/http';
import { check, sleep } from 'k6';
import { thresholds, BASE_URL } from './options.js';

// Smoke test: a single user, short duration - verifies the system works under
// minimal load before running heavier profiles.
export const options = {
  vus: 1,
  duration: '15s',
  thresholds,
};

export default function () {
  const res = http.get(`${BASE_URL}/api/users`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns users': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });
  sleep(1);
}
