const chartRefs = {};
function destroyChart(id) { if (chartRefs[id]) chartRefs[id].destroy(); }
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
function labelsFor(selection) { return getVisibleBusinesses(selection).map((b) => b.name); }
function renderRevenueChart(selection) {
  const businesses = getVisibleBusinesses(selection); destroyChart('revenueChart');
  chartRefs.revenueChart = new Chart(document.getElementById('revenueChart'), { type: 'bar', data: { labels: businesses.map(b => b.name), datasets: [
    { label: 'Trading income', data: businesses.map(b => b.tradingIncome), backgroundColor: businesses.map(b => b.color) },
    { label: 'Shared income', data: businesses.map(b => b.sharedIncome), backgroundColor: COLORS.shared },
    { label: 'Adjustments', data: businesses.map(b => b.adjustmentsRevenue), backgroundColor: COLORS.accent }
  ]}, options: chartOptions(true) });
}
function renderCostsChart(selection) {
  const businesses = getVisibleBusinesses(selection); destroyChart('costsChart');
  chartRefs.costsChart = new Chart(document.getElementById('costsChart'), { type: 'bar', data: { labels: businesses.map(b => b.name), datasets: [
    { label: 'Direct costs', data: businesses.map(b => b.directCosts + b.outsourcingCost), backgroundColor: COLORS.costs },
    { label: 'Shared costs', data: businesses.map(b => b.sharedCosts), backgroundColor: COLORS.shared },
    { label: 'Adjustments', data: businesses.map(b => b.adjustmentsCosts), backgroundColor: COLORS.accent }
  ]}, options: chartOptions(true) });
}
function renderProfitChart(selection) {
  const businesses = getVisibleBusinesses(selection); destroyChart('profitChart');
  chartRefs.profitChart = new Chart(document.getElementById('profitChart'), { type: 'bar', data: { labels: businesses.map(b => b.name), datasets: [{ label: 'Net profit', data: businesses.map(b => b.profit), backgroundColor: businesses.map(b => b.profit >= 0 ? b.color : COLORS.costs) }]}, options: chartOptions(false) });
}
function renderBridge(selection) {
  const businesses = getVisibleBusinesses(selection);
  const revenue = businesses.reduce((t,b)=>t+b.revenue,0), direct = businesses.reduce((t,b)=>t+b.directCosts+b.outsourcingCost,0), shared = businesses.reduce((t,b)=>t+b.sharedCosts,0), adj = businesses.reduce((t,b)=>t+b.adjustmentsCosts-b.adjustmentsRevenue,0), profit = revenue - direct - shared - adj;
  destroyChart('bridgeChart');
  chartRefs.bridgeChart = new Chart(document.getElementById('bridgeChart'), { type: 'bar', data: { labels: ['Revenue', 'Direct costs', 'Shared costs', 'Adjustments', 'Net profit'], datasets: [{ label: 'Profit bridge', data: [revenue, -direct, -shared, -adj, profit], backgroundColor: [COLORS.accent, COLORS.costs, COLORS.shared, COLORS.outsourcing, profit >= 0 ? COLORS.life : COLORS.costs] }] }, options: chartOptions(false) });
}
function renderForecast(selection) {
  const businesses = getVisibleBusinesses(selection); destroyChart('forecastChart');
  chartRefs.forecastChart = new Chart(document.getElementById('forecastChart'), { type: 'bar', data: { labels: businesses.map(b => b.name), datasets: [
    { label: 'Actual YTD profit', data: businesses.map(b => b.profit), backgroundColor: businesses.map(b => b.color) },
    { label: 'Forecast full-year profit', data: businesses.map(b => b.forecastProfit), backgroundColor: COLORS.shared }
  ]}, options: chartOptions(false) });
}
function renderValidation() {
  const el = document.getElementById('validationNote');
  if (el) el.innerHTML = `Validation: total profit before reallocations ${money(model.beforeProfit)}; after separation of Outsourcing ${money(model.afterProfit)}. Difference ${money(model.validationDelta)}.`;
}
function updateDashboard() { const selection = document.getElementById('businessSelect').value; renderRevenueChart(selection); renderCostsChart(selection); renderProfitChart(selection); renderBridge(selection); renderForecast(selection); }
document.addEventListener('DOMContentLoaded', () => { renderKpis(); renderValidation(); updateDashboard(); document.getElementById('businessSelect')?.addEventListener('change', updateDashboard); });
