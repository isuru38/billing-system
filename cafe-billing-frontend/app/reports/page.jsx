'use client';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [revenue, setRevenue]     = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [daily, setDaily]         = useState(null);
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/reports/revenue').then(r => r.json()),
      fetch('http://localhost:8080/api/reports/top-products').then(r => r.json()),
    ]).then(([r, t]) => { setRevenue(r); setTopProducts(t); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  async function loadDaily() {
    try {
      const res = await fetch(`http://localhost:8080/api/reports/daily?date=${date}`);
      setDaily(await res.json());
    } catch(e) { console.error(e); }
  }

  const revenueCards = revenue ? [
    { label: "Today's Revenue",  value: `$${Number(revenue.todayRevenue).toFixed(2)}`,  icon:'◈', gold:true  },
    { label: "Week Revenue",     value: `$${Number(revenue.weekRevenue).toFixed(2)}`,   icon:'◉', gold:false },
    { label: "Month Revenue",    value: `$${Number(revenue.monthRevenue).toFixed(2)}`,  icon:'◌', gold:false },
    { label: "Today's Orders",   value: revenue.todayOrders,  icon:'✦', gold:false },
    { label: "Week Orders",      value: revenue.weekOrders,   icon:'◎', gold:false },
    { label: "Month Orders",     value: revenue.monthOrders,  icon:'▣', gold:false },
  ] : [];

  const rankColors = ['#D4AF37','#9A9A9A','#CD7F32'];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Reports & <span>Analytics</span></h1>
        <p className="page-subtitle">Track your café's performance and insights</p>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <>
          {/* Revenue Cards */}
          <div className="stat-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:22}}>
            {revenueCards.slice(0,3).map((c,i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">{c.icon}</div>
                <div className="stat-label">{c.label}</div>
                <div className={`stat-value ${c.gold?'gold':''}`}>{c.value}</div>
              </div>
            ))}
          </div>
          <div className="stat-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:22}}>
            {revenueCards.slice(3).map((c,i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">{c.icon}</div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>

            {/* Daily Report */}
            <div className="card card-gold">
              <h2 className="table-title" style={{marginBottom:16}}>Daily Report</h2>
              <div style={{display:'flex',gap:10,marginBottom:16}}>
                <input type="date" className="input" value={date}
                  onChange={e => setDate(e.target.value)} style={{flex:1}} />
                <button className="btn btn-gold" onClick={loadDaily}>
                  Generate
                </button>
              </div>

              {!daily ? (
                <div className="empty-state" style={{padding:'30px 0'}}>
                  <div className="empty-state-icon" style={{fontSize:28}}>◌</div>
                  <div className="empty-state-text">Select a date and click Generate</div>
                </div>
              ) : (
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                    {[
                      { label:'Date', value: daily.date },
                      { label:'Total Orders', value: daily.totalOrders },
                      { label:'Total Revenue', value: `$${daily.totalRevenue}`, gold:true },
                      { label:'Total Tax', value: `$${daily.totalTax}` },
                      { label:'Avg Order Value', value: `$${daily.averageOrderValue}`, gold:true },
                    ].map((item,i) => (
                      <div key={i} style={{background:'var(--bg-2)',borderRadius:'var(--radius-sm)',padding:'12px 14px',border:'1px solid var(--border)'}}>
                        <p style={{fontSize:10,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1.2,marginBottom:5}}>
                          {item.label}
                        </p>
                        <p style={{fontSize:16,fontFamily:"'Playfair Display',serif",color: item.gold ? 'var(--gold)' : 'var(--text)'}}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {daily.paymentMethodBreakdown && (
                    <div>
                      <p style={{fontSize:11,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1.2,marginBottom:10}}>
                        Payment Breakdown
                      </p>
                      {Object.entries(daily.paymentMethodBreakdown).map(([method, count]) => (
                        <div key={method} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 12px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)',marginBottom:7}}>
                          <span style={{fontSize:13}}>{method}</span>
                          <span className="badge badge-gold">{count} orders</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="card card-gold">
              <h2 className="table-title" style={{marginBottom:16}}>
                Top Products <span style={{fontSize:12,color:'var(--text-3)',fontWeight:400,fontFamily:'DM Sans'}}>— last 30 days</span>
              </h2>
              {topProducts.length === 0 ? (
                <div className="empty-state" style={{padding:'30px 0'}}>
                  <div className="empty-state-icon" style={{fontSize:28}}>◉</div>
                  <div className="empty-state-text">No sales data yet</div>
                </div>
              ) : topProducts.map((p, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)',marginBottom:10}}>
                  <div style={{width:30,height:30,borderRadius:'50%',background: i < 3 ? `${rankColors[i]}20` : 'var(--bg-4)',border:`1px solid ${i < 3 ? rankColors[i] : 'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color: i < 3 ? rankColors[i] : 'var(--text-3)',flexShrink:0}}>
                    {i+1}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:500,marginBottom:3}}>{p.productName}</p>
                    <p style={{fontSize:11.5,color:'var(--text-3)'}}>{p.totalQuantitySold} units sold</p>
                  </div>
                  <span style={{fontFamily:"'Playfair Display',serif",color:'var(--gold)',fontSize:16,fontWeight:600}}>
                    ${Number(p.totalRevenue).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </>
      )}
    </div>
  );
}