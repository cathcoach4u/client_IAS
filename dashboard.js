function moneyRound(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

const FORWARD_REVENUE = {
  general: { may: 76300, june: 153600 },
  life:    { may: 66500, june: 63850  }
};

const OUTSOURCING_ACTUALS = {
  ytd:  { revenue: 48137, costs: 48795 },
  may:  { revenue: 18913, costs: 16356 },
  june: { revenue: 18913, costs: 16356 }
};

const BUSINESS_META = {
  general:     { name: 'General',     tag: 'Managed',     tagCls: 'general' },
  life:        { name: 'Life',        tag: 'Managed',     tagCls: 'life' },
  outsourcing: { name: 'Outsourcing', tag: 'Early stage', tagCls: 'outsourcing' }
};

const ASSUMPTIONS = {
  general: [
    '<strong>Forward revenue:</strong> May $76,300 + June $153,600 = $229,900 of additional invoiced revenue expected.',
    'Receives half of the shared income pool.',
    'Receives half of the shared cost pool (after the $50,000 Outsourcing carve-out).',
    'Includes the Jo $60,000 expense transfer received from Life.'
  ],
  life: [
    '<strong>Forward revenue:</strong> May $66,500 + June $63,850 = $130,350 of additional invoiced revenue expected.',
    'Receives half of the shared income pool.',
    'Receives half of the shared cost pool (after the $50,000 Outsourcing carve-out).',
    'Reduced by the Jo $60,000 expense transfer to General.'
  ],
  outsourcing: [
    'Income shown: YTD to 30 April $48,137, May $18,913, June $18,913.',
    'Expenses shown: YTD to 30 April $48,795, May $16,356, June $16,356.',
    '<strong>10% of Jo\'s salary</strong> is allocated to IAS Outsourcing. <em>Jo\'s salary: $22,000 · Allocation to Outsourcing: $2,200</em>',
    '<strong>20% of Leah\'s salary</strong> is allocated to IAS Outsourcing. <em>Leah\'s salary: $25,000 · Allocation to Outsourcing: $5,000</em>',
    '<strong>Combined salary allocation to IAS Outsourcing: $7,200.</strong>'
  ]
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

function getBusinessFigures(businessKey) {
  if (businessKey === 'outsourcing') {
    const a = OUTSOURCING_ACTUALS;
    return {
      ytdRevenue: a.ytd.revenue,
      ytdCosts: a.ytd.costs,
      mayJuneRevenue: a.may.revenue + a.june.revenue,
      mayJuneCosts: a.may.costs + a.june.costs,
      mayJuneCostNote: 'Forward estimate'
    };
  }
  const b = getBusiness(businessKey);
  const fwd = FORWARD_REVENUE[businessKey];
  return {
    ytdRevenue: b.tradingIncome,
    ytdCosts: b.costs,
    mayJuneRevenue: fwd.may + fwd.june,
    mayJuneCosts: (b.costs / 10) * 2,
    mayJuneCostNote: 'Forward estimate'
  };
}

function buildBusinessRow(businessKey) {
  const meta = BUSINESS_META[businessKey];
  const f = getBusinessFigures(businessKey);
  const fyRevenue = f.ytdRevenue + f.mayJuneRevenue;
  const fyCosts = f.ytdCosts + f.mayJuneCosts;

  const cards = [
    buildCard(businessKey, 'YTD to 30 April', '10 months actual', f.ytdRevenue, f.ytdCosts),
    buildCard(businessKey, 'May + June', f.mayJuneCostNote, f.mayJuneRevenue, f.mayJuneCosts),
    buildCard(businessKey, 'Potential FY total', 'YTD + estimate', fyRevenue, fyCosts)
  ].join('');

  const assumptionItems = ASSUMPTIONS[businessKey].map(t => `<li>${t}</li>`).join('');

  return `<section class="business-row">
    <header class="business-row__head"><h2>${meta.name}</h2></header>
    <div class="grid kpi-grid kpi-grid--three">${cards}</div>
    <aside class="card business-assumptions ${businessKey}">
      <h3>${meta.name} — assumptions</h3>
      <ul>${assumptionItems}</ul>
    </aside>
  </section>`;
}

function renderKpis() {
  const wrap = document.getElementById('kpiGrid');
  if (!wrap) return;
  wrap.innerHTML = ['general', 'life', 'outsourcing'].map(buildBusinessRow).join('');
}
document.addEventListener('DOMContentLoaded', renderKpis);
