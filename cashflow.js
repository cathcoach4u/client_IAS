let cashCharts = {};
const months = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
const scenarios = { base: { revenue: 1, costs: 1 }, growth: { revenue: 1.12, costs: 1.06 }, conservative: { revenue: .92, costs: .98 } };
function monthlyInputs() { return { revenue: Object.values(model.businesses).reduce((t,b)=>t+b.forecastRevenue,0)/12, costs: Object.values(model.businesses).reduce((t,b)=>t+b.forecastCosts,0)/12 }; }
function calcCashflow() {
  const scenario = scenarios[document.getElementById('scenario').value];
  const revTiming = Number(document.getElementById('revenueTiming').value) / 100;
  const costTiming = Number(document.getElementById('costTiming').value) / 100;
  const opening = Number(document.getElementById('openingBalance').value);
  const base = monthlyInputs(); let balance = opening;
  return months.map((m, idx) => { const cashIn = base.revenue * scenario.revenue * revTiming * (idx % 3 === 2 ? 1.04 : 1); const cashOut = base.costs * scenario.costs * costTiming * (idx === 0 ? 1.02 : 1); const net = cashIn - cashOut; const open = balance; balance += net; return { month: m, open, cashIn, cashOut, net, close: balance }; });
}
function renderCashflow() {
  const rows = calcCashflow(); Object.values(cashCharts).forEach(c => c.destroy());
  cashCharts.cash = new Chart(document.getElementById('cashflowChart'), { type: 'bar', data: { labels: rows.map(r=>r.month), datasets: [{ label: 'Cash in', data: rows.map(r=>r.cashIn), backgroundColor: COLORS.life }, { label: 'Cash out', data: rows.map(r=>r.cashOut), backgroundColor: COLORS.costs }, { label: 'Net', data: rows.map(r=>r.net), type: 'line', borderColor: COLORS.accent, backgroundColor: COLORS.accent, tension: .35 }] }, options: chartOptions(false) });
  cashCharts.balance = new Chart(document.getElementById('balanceChart'), { type: 'line', data: { labels: rows.map(r=>r.month), datasets: [{ label: 'Closing bank balance', data: rows.map(r=>r.close), borderColor: COLORS.accent, backgroundColor: 'rgba(37,99,235,.12)', fill: true, tension: .35 }] }, options: chartOptions(false) });
  document.getElementById('balanceTable').innerHTML = '<div class="table-row header"><span>Month</span><span>Opening</span><span>Movement</span><span>Closing</span></div>' + rows.map(r=>`<div class="table-row"><strong>${r.month}</strong><span>${money(r.open)}</span><span>${money(r.net)}</span><span>${money(r.close)}</span></div>`).join('');
}
document.addEventListener('DOMContentLoaded', () => { renderCashflow(); ['scenario','revenueTiming','costTiming','openingBalance'].forEach(id => document.getElementById(id).addEventListener('input', renderCashflow)); });
