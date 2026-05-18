function renderKpis() {
  const wrap = document.getElementById('kpiGrid');
  if (!wrap) return;
  wrap.innerHTML = ['general', 'life', 'outsourcing'].map((key) => {
    const b = getBusiness(key);
    return `<article class="card kpi-card ${key}">
      <div class="kpi-head"><h2>${b.name}</h2><span class="tag ${key}">${key === 'outsourcing' ? 'Early stage' : 'Managed'}</span></div>
      <div class="metric-row">
        <div class="metric"><span>Revenue</span><strong>${money(b.revenue)}</strong></div>
        <div class="metric"><span>Costs</span><strong>${money(b.costs)}</strong></div>
        <div class="metric"><span>Net Profit</span><strong class="${b.profit >= 0 ? 'profit' : 'loss'}">${money(b.profit)}</strong></div>
      </div>
      <div class="forecast-line"><span>Forecast vs Actual profit</span><strong>${money(b.forecastProfit)} vs ${money(b.profit)}</strong></div>
    </article>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', renderKpis);
