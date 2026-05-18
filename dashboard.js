function moneyRound(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Math.round(value || 0));
}
function renderKpis() {
  const wrap = document.getElementById('kpiGrid');
  if (!wrap) return;
  wrap.innerHTML = ['general', 'life', 'outsourcing'].map((key) => {
    const b = getBusiness(key);
    const revenue = b.tradingIncome;
    const costs = b.costs;
    const profit = revenue - costs;
    const forecastProfit = (profit / 10) * 12;
    return `<article class="card kpi-card ${key}">
      <div class="kpi-head"><h2>${b.name}</h2><span class="tag ${key}">${key === 'outsourcing' ? 'Early stage' : 'Managed'}</span></div>
      <div class="metric-row">
        <div class="metric"><span>Revenue (YTD to 30 April)</span><strong>${moneyRound(revenue)}</strong></div>
        <div class="metric"><span>Costs (YTD to 30 April)</span><strong>${moneyRound(costs)}</strong></div>
        <div class="metric"><span>Net Profit (YTD to 30 April)</span><strong class="${profit >= 0 ? 'profit' : 'loss'}">${moneyRound(profit)}</strong></div>
      </div>
      <div class="forecast-line"><span>Forecast vs Actual profit (full year)</span><strong>${moneyRound(forecastProfit)} vs ${moneyRound(profit)}</strong></div>
    </article>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', renderKpis);
