// Shared SLA thresholds and target URL for the k6 scenarios.
// A run fails if any threshold is breached - these encode the performance budget.
export const thresholds = {
  http_req_failed: ['rate<0.01'], // < 1% of requests may fail
  http_req_duration: ['p(95)<800'], // 95th percentile under 800ms
  checks: ['rate>0.99'], // > 99% of functional checks pass
};

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:5050';
