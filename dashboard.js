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

const VIABILITY_OVERRIDES = {
  general: {
    ytdCosts: 648498,
    ytdCostBreakdown: 'April YTD: Xero $411,025 · Operations 50% $204,473 · Jo\'s salary 20% $33,000'
  },
  life: {
    ytdCosts: 654688,
    ytdCostBreakdown: 'April YTD: Xero $483,215 · 50% of operations less $33,000'
  }
};

const BUSINESS_META = {
  general:     { name: 'General' },
  life:        { name: 'Life' },
  outsourcing: { name: 'Outsourcing' }
};

const COMMON_ASSUMPTIONS = [
  '<strong>Operations base:</strong> total operations $408,945 (rent, compliance, Leah &amp; Dimple salaries; excludes Jo\'s pre-March salary). 50% allocated to each of General and Life.',
  '<strong>Jo\'s salary split:</strong> 70% FP/Life · 20% General · 10% Outsourcing.'
];

const ASSUMPTIONS = {
  general: [
    '<strong>Forward revenue:</strong> May $76,300 + June $153,600 = $229,900 of additional invoiced revenue expected.',
    '<strong>YTD costs ($648,498):</strong> Current Xero costs $411,025 + 50% of operations $204,473 + Jo\'s salary 20% share $33,000.',
    ...COMMON_ASSUMPTIONS,
    '<span class="question">Does the lead of the General team expect to end the year with the figures above? Any accounts in danger?</span>'
  ],
  life: [
    '<strong>Forward revenue:</strong> May $66,500 + June $63,850 = $130,350 of additional invoiced revenue expected.',
    '<strong>YTD costs ($654,688):</strong> Current Xero costs $483,215 + 50% of operations less $33,000.',
    ...COMMON_ASSUMPTIONS
  ],
  outsourcing: [
    'Income shown: YTD to 30 April $48,137 · May $18,913 · June $18,913.',
    'Expenses shown: YTD to 30 April $48,795 · May $16,356 · June $16,356.',
    '<strong>20% of Leah\'s salary</strong> ($25,000) → $5,000 allocated to IAS Outsourcing.',
    ...COMMON_ASSUMPTIONS
  ]
};

function profitClass(v) { return v == null ? null : (v >= 0 ? 'profit' : 'loss'); }

function metricCell(label, value, cls, breakdown) {
  if (value == null) {
    return `<div class="metric"><span>${label}</span><strong class="placeholder">—</strong></div>`;
  }
  const c = cls ? ` class="${cls}"` : '';
  if (breakdown) {
    return `<div class="metric metric--with-detail"><div class="metric-main"><span>${label}</span><strong${c}>${moneyRound(value)}</strong></div><div class="metric-breakdown">${breakdown}</div></div>`;
  }
  return `<div class="metric"><span>${label}</span><strong${c}>${moneyRound(value)}</strong></div>`;
}

function buildCard(businessKey, period, periodSub, revenue, costs, costBreakdown) {
  const profit = (revenue == null || costs == null) ? null : revenue - costs;
  return `<article class="card kpi-card ${businessKey}">
    <div class="kpi-head"><h3>${period}</h3>${periodSub ? `<span class="period-sub">${periodSub}</span>` : ''}</div>
    <div class="metric-row">
      ${metricCell('Revenue', revenue)}
      ${metricCell('Costs', costs, null, costBreakdown)}
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
      ytdCostBreakdown: null,
      mayJuneRevenue: a.may.revenue + a.june.revenue,
      mayJuneCosts: a.may.costs + a.june.costs
    };
  }
  const b = getBusiness(businessKey);
  const fwd = FORWARD_REVENUE[businessKey];
  const v = VIABILITY_OVERRIDES[businessKey];
  const ytdCosts = v && v.ytdCosts != null ? v.ytdCosts : b.costs;
  const mayJuneCosts = (ytdCosts / 10) * 2;
  return {
    ytdRevenue: b.tradingIncome,
    ytdCosts,
    ytdCostBreakdown: v ? v.ytdCostBreakdown : null,
    mayJuneRevenue: fwd.may + fwd.june,
    mayJuneCosts,
    mayJuneCostBreakdown: businessKey === 'general'
      ? 'Pro-rata from YTD $648,498 ÷ 10 × 2 (expenses fairly consistent month to month)'
      : (businessKey === 'life'
          ? 'Pro-rata from YTD $654,688 ÷ 10 × 2 (expenses fairly consistent month to month)'
          : null)
  };
}

function buildBusinessRow(businessKey) {
  const meta = BUSINESS_META[businessKey];
  const f = getBusinessFigures(businessKey);
  const fyRevenue = f.ytdRevenue + f.mayJuneRevenue;
  const fyCosts = f.ytdCosts + f.mayJuneCosts;

  const cards = [
    buildCard(businessKey, 'YTD to 30 April', '10 months actual', f.ytdRevenue, f.ytdCosts, f.ytdCostBreakdown),
    buildCard(businessKey, 'May + June', 'Forward estimate', f.mayJuneRevenue, f.mayJuneCosts, f.mayJuneCostBreakdown),
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
