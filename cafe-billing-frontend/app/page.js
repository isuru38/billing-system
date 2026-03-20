'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders:0, todayRevenue:0, totalProducts:0, totalCustomers:0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, r, p, c] = await Promise.all([
          fetch('http://localhost:8080/api/orders/today').then(x=>x.json()).catch(()=>[]),
          fetch('http://localhost:8080/api/reports/revenue').then(x=>x.json()).catch(()=>({})),
          fetch('http://localhost:8080/api/products').then(x=>x.json()).catch(()=>[]),
          fetch('http://localhost:8080/api/customers').then(x=>x.json()).catch(()=>[]),
        ]);
        setStats({
          todayOrders:   Array.isArray(o) ? o.length : 0,
          todayRevenue:  r?.todayRevenue  || 0,
          totalProducts: Array.isArray(p) ? p.length : 0,
          totalCustomers:Array.isArray(c) ? c.length : 0,
        });
        setOrders(Array.isArray(o) ? o.slice(0,8) : []);
      } catch(e){ console.error(e); }
      finally{ setLoading(false); }
    }
    load();
  }, []);

  const cards = [
    { label:"Today's Orders",  value: stats.todayOrders,                          icon:'✦', gold:false },
    { label:"Today's Revenue", value:`$${Number(stats.todayRevenue).toFixed(2)}`, icon:'◈', gold:true  },
    { label:'Total Products',  value: stats.totalProducts,                        icon:'◉', gold:false },
    { label:'Total Customers', value: stats.totalCustomers,                       icon:'◎', gold:false },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, <span>Chef</span></h1>
        <p className="page-subtitle">Here is your cafe performance at a glance</p>
      </div>

      <div className="stat-grid">
        {cards.map((c,i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-label">{c.label}</div>
            <div className={`stat-value ${c.gold?'gold':''}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Today's Orders</h2>
          <span className="badge badge-gold">{orders.length} orders</span>
        </div>
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <div className="empty-state-text">No orders placed today yet</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th>
                <th>Payment</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{color:'var(--gold)',fontWeight:500}}>#{o.id}</td>
                  <td>{o.customer?.name||'Walk-in'}</td>
                  <td style={{color:'var(--text-2)'}}>{o.items?.length||0} items</td>
                  <td><span className="badge badge-gold">{o.paymentMethod}</span></td>
                  <td style={{fontFamily:"'Playfair Display',serif",color:'var(--gold)',fontSize:15}}>
                    ${o.totalAmount}
                  </td>
                  <td><span className="badge badge-green">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}