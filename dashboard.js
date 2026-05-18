function moneyRound(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

const FORWARD_REVENUE = {
  general:     { may: 76300, june: 153600 },
  life:        { may: 66500, june: 63850 },
  outsourcing: { may: null,  june: null }
};

const BUSINESS_META = {
  general:     { tag: 'Managed',     tagCls: 'general' },
  life:        { tag: 'Managed',     tagCls: 'life' },
  outsourcing: { tag: 'Early stage', tagCls: 'outsourcing' }
};

function profitClass(v) { return v == null ? null : (v >= 0 ? 'profit' : 'loss'); }

function metricCell(label, value, cls) {
  if (value == null) {
    return `<div class="metric"><span>${label}</span><strong class="placeholder">—</strong></div>`;
  }
  const c = cls ? ` class="${cls}"` : '';
  return `<div class="metric"><span>${label}</span><strong${c}>${moneyRound(value)}</strong></div>`;
}

function buildCard(businessKey, period, periodSub, revenue, costs) {
  const profit = (revenue == null || costs == null) ? null : revenue - costs;
  return `<article class="card kpi-card ${businessKey}">
    <div class="kpi-head"><h3>${period}</h3>${periodSub ? `<span class="period-sub">${periodSub}</span>` : ''}</div>
    <div class="metric-row">
      ${metricCell('Revenue', revenue)}
      ${metricCell('Costs', costs)}
      ${metricCell('Net Profit', profit, profitClass(profit))}
    </div>
  </article>`;
}

function buildBusinessRow(businessKey) {
  const b = getBusiness(businessKey);
  const meta = BUSINESS_META[businessKey];
  const fwd = FORWARD_REVENUE[businessKey];

  const ytdRevenue = b.tradingIncome;
  const ytdCosts = b.costs;

  const mayJuneRevenue = (fwd.may != null && fwd.june != null) ? (fwd.may + fwd.june) : null;
  const mayJuneCosts = (mayJuneRevenue != null && ytdCosts != null) ? (ytdCosts / 10) * 2 : null;

  const fyRevenue = (mayJuneRevenue != null) ? (ytdRevenue + mayJuneRevenue) : null;
  const fyCosts = (mayJuneCosts != null) ? (ytdCosts + mayJuneCosts) : null;

  const cards = [
    buildCard(businessKey, 'YTD to 30 April', '10 months actual', ytdRevenue, ytdCosts),
    buildCard(businessKey, 'May + June', mayJuneRevenue != null ? 'Forward estimate' : 'Figures pending', mayJuneRevenue, mayJuneCosts),
    buildCard(businessKey, 'Potential FY total', fyRevenue != null ? 'YTD + estimate' : 'Figures pending', fyRevenue, fyCosts)
  ].join('');

  return `<section class="business-row">
    <header class="business-row__head"><h2>${b.name}</h2><span class="tag ${meta.tagCls}">${meta.tag}</span></header>
    <div class="grid kpi-grid kpi-grid--three">${cards}</div>
  </section>`;
}

function renderKpis() {
  const wrap = document.getElementById('kpiGrid');
  if (!wrap) return;
  wrap.innerHTML = ['general', 'life', 'outsourcing'].map(buildBusinessRow).join('');
}
document.addEventListener('DOMContentLoaded', renderKpis);
