import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  duration: "10s",
  vus: 50,
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const res = http.get("http://localhost:3000/products");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "transaction time OK": (r) => r.timings.duration < 200,
  });

  sleep(1);
}
