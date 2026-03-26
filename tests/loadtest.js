import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
    duration: '10s', // test sur 10 secondes
    vus: 50, // 50 utilisateurs virtuels
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% des requêtes doivent être inférieures à 500ms
    },
};

export default function () {
    const res = http.get('http://localhost:3000/products');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'transaction time OK': (r) => r.timings.duration < 500,
    });
    sleep(1);
}