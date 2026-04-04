/* KIDA Investment — Performance Chart
   Reads data/performance.json → renders Chart.js line chart
   To update monthly: add 1 line to performance.json */

async function loadData() {
  const res = await fetch('./data/performance.json');
  if (!res.ok) throw new Error('Không đọc được performance.json');
  return res.json();
}

function fmt(iso) {
  const d = new Date(iso + 'T00:00:00');
  return `T${d.getMonth() + 1}/${d.getFullYear()}`;
}

function buildChart(data) {
  const ctx = document.getElementById('performanceChart').getContext('2d');

  /* Gradient fill cho KIDA */
  const grd = ctx.createLinearGradient(0, 0, 0, 600);
  grd.addColorStop(0,   'rgba(29, 78, 216, 0.30)');
  grd.addColorStop(0.6, 'rgba(29, 78, 216, 0.08)');
  grd.addColorStop(1,   'rgba(29, 78, 216, 0.01)');

  const grdVN = ctx.createLinearGradient(0, 0, 0, 600);
  grdVN.addColorStop(0,   'rgba(100, 116, 139, 0.18)');
  grdVN.addColorStop(1,   'rgba(100, 116, 139, 0.01)');

  /* Tính % tổng sinh lời để hiển thị tooltip */
  const base = data[0];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(x => fmt(x.date)),
      datasets: [
        {
          label: 'KIDA Portfolio',
          data: data.map(x => x.kida),
          borderColor: '#1d4ed8',
          backgroundColor: grd,
          fill: true,
          borderWidth: 2.5,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#1d4ed8',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1d4ed8',
          pointHoverBorderWidth: 2,
          tension: 0.3,
          order: 1,
        },
        {
          label: 'VN-Index',
          data: data.map(x => x.vnindex),
          borderColor: '#64748b',
          backgroundColor: grdVN,
          fill: true,
          borderWidth: 2,
          pointRadius: 1.5,
          pointHoverRadius: 5,
          pointBackgroundColor: '#64748b',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#64748b',
          pointHoverBorderWidth: 2,
          tension: 0.3,
          order: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false }, /* legend được render thủ công trong HTML */
        tooltip: {
          backgroundColor: '#0D1F3C',
          titleColor: '#C9A227',
          bodyColor: 'rgba(255,255,255,0.85)',
          borderColor: 'rgba(201,162,39,0.3)',
          borderWidth: 1,
          padding: 14,
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 13 },
          callbacks: {
            title: (items) => items[0].label,
            label: (item) => {
              const val = item.raw;
              const pct = ((val - 100) / 100 * 100).toFixed(1);
              const sign = pct >= 0 ? '+' : '';
              return ` ${item.dataset.label}: ${val.toLocaleString('vi-VN')} triệu  (${sign}${pct}%)`;
            },
            afterBody: (items) => {
              if (items.length < 2) return '';
              const kida = items.find(i => i.dataset.label === 'KIDA Portfolio')?.raw;
              const vn   = items.find(i => i.dataset.label === 'VN-Index')?.raw;
              if (!kida || !vn) return '';
              const diff = (kida - vn).toFixed(1);
              const sign = diff >= 0 ? '+' : '';
              return [``, ` Vượt trội so với VN-Index: ${sign}${diff}`];
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#5A6A82',
            maxTicksLimit: 14,
            font: { size: 11 },
            maxRotation: 45,
          },
          grid: { color: '#EEE9DC', lineWidth: 1 },
          border: { color: '#DDD8CC' }
        },
        y: {
          min: 50,
          ticks: {
            color: '#5A6A82',
            font: { size: 11 },
            callback: (v) => v + ' tr'
          },
          grid: { color: '#EEE9DC', lineWidth: 1 },
          border: { color: '#DDD8CC', dash: [4, 4] },
          title: {
            display: true,
            text: 'Giá trị (Triệu đồng, gốc = 100 tr)',
            color: '#5A6A82',
            font: { size: 11 }
          }
        }
      }
    }
  });
}

loadData().then(buildChart).catch(err => {
  console.error('Chart load error:', err);
  document.querySelector('.chart-container').innerHTML =
    '<p style="text-align:center;padding:40px;color:#888">Không thể tải dữ liệu chart. Vui lòng chạy server tĩnh.</p>';
});
