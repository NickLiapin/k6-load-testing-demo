# k6 Load & Performance Testing

[![Load Tests](https://github.com/NickLiapin/k6-load-testing-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/NickLiapin/k6-load-testing-demo/actions/workflows/ci.yml)
[![k6](https://img.shields.io/badge/k6-load%20testing-7D64FF?logo=k6&logoColor=white)](https://k6.io)

Load and performance testing with **[k6](https://k6.io)** - smoke and ramping-load
profiles with **SLA thresholds** enforced as pass/fail gates, wired into CI.

The target is a small **bundled service** (`server/`), so the suite is **hermetic**:
it runs the same locally and in CI without an external environment. (In a real
engagement the same scripts point at a properly provisioned, resource-bounded test
stand - the meaningful way to find where a system actually degrades.)

## What this demonstrates

- **Scenario design** - a `smoke` profile (1 VU) and a `load` profile (ramp to 20 VUs,
  hold, ramp down).
- **SLAs as thresholds** - the run **fails** if error rate >= 1%, p95 latency >= 800 ms,
  or functional checks drop below 99%. See [`scripts/options.js`](scripts/options.js).
- **Functional checks under load** - status codes and payloads are asserted while load is applied.
- **Result capture** - the full result is written to `summary.json` (uploaded as a CI artifact).
- **Hermetic CI** - the target is started in the workflow; k6 runs against `localhost`.

## Scripts

| Script | Profile | Purpose |
|--------|---------|---------|
| [`scripts/smoke.js`](scripts/smoke.js) | 1 VU, 15s | sanity under minimal load |
| [`scripts/load.js`](scripts/load.js) | ramp -> 20 VUs -> ramp down | behaviour under sustained load |

## Running locally

Requires [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) and Node.js.

```bash
npm install
npm start          # start the target service (port 5050) in one terminal
npm run smoke      # in another terminal
npm run load
```

Point at a different target with `BASE_URL=https://your-env k6 run scripts/load.js`.

## Continuous Integration

On every push / pull request, GitHub Actions starts the bundled service, installs k6,
and runs the smoke and load profiles. Threshold breaches fail the build; the k6 summary
is uploaded as an artifact.

## Tech

k6, JavaScript, Express (target), GitHub Actions

---

Built by **Nick Liapin** - Senior SDET / QA Automation Engineer.
