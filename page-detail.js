function renderSingleKpi(key) {
  const b = getBusiness(key);
  document.getElementById('singleKpi').innerHTML = `<article class="card kpi-card single-kpi-card ${key}">
    <div class="kpi-head">
      <h2>${b.name} Performance</h2>
      <span class="tag ${key}">YTD April</span>
    </div>
    <div class="metric-row">
      <div class="metric"><span>Revenue</span><strong>${money(b.revenue)}</strong></div>
      <div class="metric"><span>Costs</span><strong>${money(b.costs)}</strong></div>
      <div class="metric"><span>Net Profit</span><strong class="${b.profit >= 0 ? 'profit' : 'loss'}">${money(b.profit)}</strong></div>
    </div>
    <div class="forecast-line"><span>Full-year forecast profit</span><strong>${money(b.forecastProfit)}</strong></div>
  </article>`;
}
function renderLineItems(key) {
  const b = getBusiness(key);
  const revenueLines = b.sourceRevenueKey ? linesFor(rawData.revenue, b.sourceRevenueKey) : [];
  const expenseLines = b.sourceExpenseKey ? linesFor(rawData.expenses, b.sourceExpenseKey) : [{ name: 'Allocated salary only', group: 'People Costs', category: 'People', value: b.outsourcingCost }];
  if (key !== 'outsourcing') revenueLines.push({ name: 'Allocated shared income', group: 'Shared income', value: b.sharedIncome });
  if (key !== 'outsourcing') expenseLines.push({ name: 'Allocated shared expenses after Outsourcing carve-out', group: 'Shared', category: 'Shared', value: b.sharedCosts }, { name: 'Jo adjustment expense transfer', group: 'Adjustments', category: 'People', value: b.adjustmentsCosts });
  document.getElementById('revenueBreakdown').innerHTML = revenueLines.map(i => `<div class="line-item"><span>${i.name}<br><small>${i.group}</small></span><strong>${money(i.value)}</strong></div>`).join('') || '<p class="small-note">No current revenue streams have been recognised in the supplied P&L.</p>';
  document.getElementById('expenseBreakdown').innerHTML = expenseLines.map(i => `<div class="line-item"><span>${i.name}<br><small>${i.group}</small></span><strong>${money(i.value)}</strong></div>`).join('');
}
function renderGroups(key) {
  const b = getBusiness(key);
  const items = b.sourceExpenseKey ? linesFor(rawData.expenses, b.sourceExpenseKey) : [{ category: 'People', value: b.outsourcingCost }];
  if (key !== 'outsourcing') items.push({ category: 'Shared', value: b.sharedCosts }, { category: 'People', value: b.adjustmentsCosts });
  const groups = ['People', 'Marketing', 'Technology', 'Admin', 'Insurance', 'Shared'].map((group) => ({ group, value: items.filter(i => i.category === group).reduce((t,i)=>t+i.value,0) }));
  const max = Math.max(...groups.map(g => Math.abs(g.value)), 1);
  document.getElementById('costGroups').innerHTML = groups.map(g => `<div class="group-row"><strong>${g.group}</strong><div class="bar"><span style="width:${Math.max(3, Math.abs(g.value)/max*100)}%; background:${g.value < 0 ? COLORS.life : (g.group === 'Shared' ? COLORS.shared : COLORS.costs)}"></span></div><span>${money(g.value)}</span></div>`).join('');
}
function renderDetailBridge(key) {
  const b = getBusiness(key);
  new Chart(document.getElementById('detailBridge'), { type: 'bar', data: { labels: ['Trading income', 'Shared income', 'Direct costs', 'Shared costs', 'Adjustments', 'Net profit'], datasets: [{ label: 'Bridge', data: [b.tradingIncome, b.sharedIncome, -(b.directCosts + b.outsourcingCost), -b.sharedCosts, -b.adjustmentsCosts, b.profit], backgroundColor: [b.color, COLORS.shared, COLORS.costs, COLORS.shared, COLORS.accent, b.profit >= 0 ? COLORS.life : COLORS.costs] }] }, options: chartOptions(false) });
}
function renderCommentary(key) {
  const copy = {
    general: `General remains the largest revenue engine, with renewal income providing the core recurring base. The Jo reallocation increases General costs by ${money(60000)}, making the view more conservative and operationally accountable.`,
    life: `Life has strong recurring and insurer ongoing income. The Jo reallocation reduces Life expenses by ${money(60000)}, while shared income and remaining shared costs are allocated equally with General.`,
    outsourcing: `Partial / Early Stage Business – limited data available. This view isolates the ${money(50000)} salary allocation only and intentionally excludes shared income and shared expenses until the business has standalone operating data.`
  };
  document.getElementById('commentary').innerHTML = `<p>${copy[key]}</p><p class="small-note">Forecast uses YTD ÷ 10 × 12. Data cutoff: April.</p>`;
}
document.addEventListener('DOMContentLoaded', () => { const key = document.body.dataset.business; renderSingleKpi(key); renderLineItems(key); renderGroups(key); renderDetailBridge(key); renderCommentary(key); });
