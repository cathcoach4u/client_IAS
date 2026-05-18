function moneyRound(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

const FORWARD_REVENUE = {
  general: { may: 76300, june: 153600 },
  life:    { may: 66500, june: 63850  }
};

const OUTSOURCING_ACTUALS = {
  ytd:  { revenue: 48137, costs: 96795 },
  may:  { revenue: 18913, costs: 16356 },
  june: { revenue: 18913, costs: 16356 }
};

const VIABILITY_OVERRIDES = {
  general: {
    ytdCosts: 622100,
    ytdCostBreakdown: 'April YTD: Xero $411,025 · Operations 50% $156,075 · Jo\'s salary 30% $55,000'
  },
  life: {
    ytdCosts: 584290,
    ytdCostBreakdown: 'April YTD: Xero $483,215 · Operations 50% $156,075 · less $55,000'
  }
};

const BUSINESS_META = {
  general:     { name: 'General' },
  life:        { name: 'Life' },
  outsourcing: { name: 'Outsourcing' }
};

const COMMON_ASSUMPTIONS = [
  '<strong>Operations base:</strong> total operations $408,945 less Outsourcing carve-out $96,795 = $312,150. 50% allocated to each of General and Life ($156,075 each).',
  '<strong>Jo\'s salary split:</strong> 60% FP/Life · 30% General · 10% Outsourcing (annual salary $220,000).'
];

const ASSUMPTIONS = {
  general: [
    '<strong>Forward revenue:</strong> May $76,300 + June $153,600 = $229,900 of additional invoiced revenue expected.',
    '<strong>YTD costs ($622,100):</strong> Current Xero costs $411,025 + 50% of operations (post-carve-out) $156,075 + Jo\'s salary 30% share $55,000.',
    ...COMMON_ASSUMPTIONS,
    '<span class="question">Does the lead of the General team expect to end the year with the figures above? Any accounts in danger?</span>'
  ],
  life: [
    '<strong>Forward revenue:</strong> May $66,500 + June $63,850 = $130,350 of additional invoiced revenue expected.',
    '<strong>YTD costs ($584,290):</strong> Xero $483,215 + Operations 50% (post-carve-out) $156,075 − $55,000.',
    ...COMMON_ASSUMPTIONS
  ],
  outsourcing: [
    '<strong>Forward revenue:</strong> May $18,913 + June $18,913 = $37,826 of additional invoiced revenue expected.',
    '<strong>YTD costs ($96,795):</strong> Xero $49,795 + Leah 25% $25,000 + Jo 10% $22,000.',
    '<strong>25% of Leah\'s salary</strong> → $25,000 allocated to IAS Outsourcing (was previously shown as 20% / $5,000 — that figure was incorrect).',
    '<strong>10% of Jo\'s salary</strong> ($220,000) → $22,000 allocated to IAS Outsourcing.',
    'The $96,795 Outsourcing cost is carved out of total operations $408,945 before the remaining $312,150 is split 50/50 between General and Life.',
    'May and June expenses use the supplied figures rather than the YTD pro-rata applied to General and Life.',
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
      ytdCostBreakdown: 'April YTD: Xero $49,795 · Leah 25% $25,000 · Jo 10% $22,000',
      mayJuneRevenue: a.may.revenue + a.june.revenue,
      mayJuneCosts: a.may.costs + a.june.costs,
      mayJuneCostBreakdown: 'May $16,356 + June $16,356 (supplied figures, not pro-rata)'
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
      ? 'Pro-rata from YTD $622,100 ÷ 10 × 2 (expenses fairly consistent month to month)'
      : (businessKey === 'life'
          ? 'Pro-rata from YTD $584,290 ÷ 10 × 2 (expenses fairly consistent month to month)'
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

function buildTotalRow() {
  const keys = ['general', 'life', 'outsourcing'];
  const figs = keys.map(getBusinessFigures);
  const totals = figs.reduce((acc, f) => ({
    ytdRevenue: acc.ytdRevenue + (f.ytdRevenue || 0),
    ytdCosts: acc.ytdCosts + (f.ytdCosts || 0),
    mayJuneRevenue: acc.mayJuneRevenue + (f.mayJuneRevenue || 0),
    mayJuneCosts: acc.mayJuneCosts + (f.mayJuneCosts || 0)
  }), { ytdRevenue: 0, ytdCosts: 0, mayJuneRevenue: 0, mayJuneCosts: 0 });
  const fyRevenue = totals.ytdRevenue + totals.mayJuneRevenue;
  const fyCosts = totals.ytdCosts + totals.mayJuneCosts;
  const partsCost = `General ${moneyRound(figs[0].ytdCosts)} · Life ${moneyRound(figs[1].ytdCosts)} · Outsourcing ${moneyRound(figs[2].ytdCosts)}`;
  const partsCostMJ = `General ${moneyRound(figs[0].mayJuneCosts)} · Life ${moneyRound(figs[1].mayJuneCosts)} · Outsourcing ${moneyRound(figs[2].mayJuneCosts)}`;
  const partsCostFY = `General ${moneyRound(figs[0].ytdCosts + figs[0].mayJuneCosts)} · Life ${moneyRound(figs[1].ytdCosts + figs[1].mayJuneCosts)} · Outsourcing ${moneyRound(figs[2].ytdCosts + figs[2].mayJuneCosts)}`;
  const cards = [
    buildCard('total', 'YTD to 30 April', 'All businesses · 10 months actual', totals.ytdRevenue, totals.ytdCosts, partsCost),
    buildCard('total', 'May + June', 'All businesses · forward estimate', totals.mayJuneRevenue, totals.mayJuneCosts, partsCostMJ),
    buildCard('total', 'Potential FY total', 'All businesses · YTD + estimate', fyRevenue, fyCosts, partsCostFY)
  ].join('');
  return `<section class="business-row business-row--total">
    <header class="business-row__head"><h2>IAS Total — whole business</h2></header>
    <div class="grid kpi-grid kpi-grid--three">${cards}</div>
  </section>`;
}

function renderKpis() {
  const wrap = document.getElementById('kpiGrid');
  if (!wrap) return;
  wrap.innerHTML = buildTotalRow() + ['general', 'life', 'outsourcing'].map(buildBusinessRow).join('');
}
document.addEventListener('DOMContentLoaded', renderKpis);
