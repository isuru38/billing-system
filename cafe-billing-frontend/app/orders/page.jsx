'use client';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [products, setProducts]   = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart]           = useState([]);
  const [customerId, setCustomerId]       = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes]         = useState('');
  const [discount, setDiscount]   = useState(0);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text:'', type:'' });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/products/available').then(r=>r.json()).catch(()=>[]),
      fetch('http://localhost:8080/api/customers').then(r=>r.json()).catch(()=>[]),
    ]).then(([p,c]) => {
      setProducts(Array.isArray(p)?p:[]);
      setCustomers(Array.isArray(c)?c:[]);
    });
  }, []);

  function addToCart(product) {
    setCart(prev => {
      const ex = prev.find(i => i.productId === product.id);
      if (ex) return prev.map(i => i.productId === product.id
        ? {...i, quantity: i.quantity+1} : i);
      return [...prev, { productId:product.id, name:product.name,
                          price:product.price, quantity:1 }];
    });
  }

  function updateQty(productId, qty) {
    if (qty < 1) { setCart(prev=>prev.filter(i=>i.productId!==productId)); return; }
    setCart(prev=>prev.map(i=>i.productId===productId?{...i,quantity:qty}:i));
  }

  function removeFromCart(productId) {
    setCart(prev=>prev.filter(i=>i.productId!==productId));
  }

  const subtotal = cart.reduce((s,i)=>s+i.price*i.quantity,0);
  const tax      = subtotal*0.05;
  const total    = subtotal+tax-discount;

  function msg(text,type='success'){
    setMessage({text,type});
    setTimeout(()=>setMessage({text:'',type:''}),4000);
  }

  async function placeOrder() {
    if (cart.length===0) return msg('Add at least one item.','error');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/orders',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          customerId: customerId||null, paymentMethod, notes,
          discountAmount: discount,
          items: cart.map(i=>({productId:i.productId,quantity:i.quantity}))
        })
      });
      const data = await res.json();
      setLastOrder(data);
      setCart([]); setCustomerId(''); setNotes(''); setDiscount(0);
      msg('Order placed successfully!');
    } catch(e){ msg('Error placing order.','error'); }
    finally{ setLoading(false); }
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">New <span>Order</span></h1>
        <p className="page-subtitle">Select items and build the order</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type==='error'?'alert-error':'alert-success'}`}>
          {message.text}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:20,alignItems:'start'}}>

        {/* ── LEFT: Products ── */}
        <div>
          <div style={{
            background:'var(--bg-3)',border:'1px solid var(--border)',
            borderRadius:'var(--radius)',overflow:'hidden'
          }}>
            {/* Panel Header */}
            <div style={{
              padding:'16px 22px',borderBottom:'1px solid var(--border)',
              display:'flex',justifyContent:'space-between',alignItems:'center',
              background:'linear-gradient(90deg,var(--bg-4),rgba(212,175,55,0.03))'
            }}>
              <h2 className="table-title">Menu</h2>
              <span className="badge badge-gold">{products.length} items</span>
            </div>

            <div style={{padding:16}}>
              {products.length===0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">◉</div>
                  <div className="empty-state-text">No products available — add products first</div>
                </div>
              ) : (
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',
                  gap:12
                }}>
                  {products.map(p => {
                    const inCart = cart.find(i=>i.productId===p.id);
                    return (
                      <div key={p.id} onClick={()=>addToCart(p)} style={{
                        background:'var(--bg-2)',border:`1px solid ${inCart?'var(--gold-border)':'var(--border)'}`,
                        borderRadius:'var(--radius)',padding:'16px',cursor:'pointer',
                        transition:'all 0.2s',position:'relative',
                        boxShadow: inCart?'0 0 0 1px var(--gold-border)':''
                      }}
                      onMouseEnter={e=>{
                        e.currentTarget.style.borderColor='var(--gold-border)';
                        e.currentTarget.style.transform='translateY(-2px)';
                      }}
                      onMouseLeave={e=>{
                        e.currentTarget.style.borderColor=inCart?'var(--gold-border)':'var(--border)';
                        e.currentTarget.style.transform='translateY(0)';
                      }}>
                        {inCart && (
                          <div style={{
                            position:'absolute',top:10,right:10,
                            background:'var(--gold)',color:'#000',
                            borderRadius:'50%',width:20,height:20,
                            fontSize:11,fontWeight:700,
                            display:'flex',alignItems:'center',justifyContent:'center'
                          }}>{inCart.quantity}</div>
                        )}
                        <p style={{
                          fontSize:13.5,fontWeight:500,marginBottom:5,
                          color:'var(--text)',paddingRight:inCart?20:0
                        }}>{p.name}</p>
                        <p style={{
                          fontSize:11.5,color:'var(--text-3)',marginBottom:12,
                          lineHeight:1.4
                        }}>{p.description||p.category||'—'}</p>
                        <div style={{
                          display:'flex',justifyContent:'space-between',
                          alignItems:'center'
                        }}>
                          <span style={{
                            fontFamily:"'Playfair Display',serif",
                            fontSize:18,fontWeight:600,color:'var(--gold)'
                          }}>${p.price}</span>
                          <span style={{
                            fontSize:10.5,color:'var(--text-3)',
                            background:'var(--bg-4)',padding:'3px 8px',
                            borderRadius:4,border:'1px solid var(--border)'
                          }}>stock: {p.stockQuantity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={{position:'sticky',top:20}}>
          <div style={{
            background:'var(--bg-3)',border:'1px solid var(--gold-border)',
            borderRadius:'var(--radius)',overflow:'hidden'
          }}>
            {/* Summary Header */}
            <div style={{
              padding:'16px 22px',borderBottom:'1px solid var(--gold-border)',
              background:'linear-gradient(90deg,rgba(212,175,55,0.05),transparent)'
            }}>
              <h2 className="table-title">Order Summary</h2>
            </div>

            <div style={{padding:'18px 20px'}}>

              {/* Customer */}
              <div className="form-group" style={{marginBottom:12}}>
                <label className="form-label">Customer</label>
                <select className="select" value={customerId}
                  onChange={e=>setCustomerId(e.target.value)}>
                  <option value="">Walk-in Customer</option>
                  {customers.map(c=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Payment */}
              <div className="form-group" style={{marginBottom:16}}>
                <label className="form-label">Payment Method</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                  {['CASH','CARD','UPI'].map(m=>(
                    <button key={m} onClick={()=>setPaymentMethod(m)} style={{
                      padding:'9px 0',borderRadius:'var(--radius-sm)',
                      border:`1px solid ${paymentMethod===m?'var(--gold)':'var(--border)'}`,
                      background: paymentMethod===m?'rgba(212,175,55,0.12)':'var(--bg-2)',
                      color: paymentMethod===m?'var(--gold)':'var(--text-2)',
                      fontSize:12.5,fontWeight:500,cursor:'pointer',
                      transition:'all 0.15s',fontFamily:'DM Sans,sans-serif'
                    }}>{m}</button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{height:1,background:'var(--border)',margin:'4px 0 14px'}} />

              {/* Cart Items */}
              <div style={{marginBottom:14}}>
                <div style={{
                  display:'flex',justifyContent:'space-between',
                  marginBottom:10
                }}>
                  <span style={{
                    fontSize:10,color:'var(--text-3)',
                    textTransform:'uppercase',letterSpacing:1.5,fontWeight:500
                  }}>Items</span>
                  {cart.length>0 && (
                    <button onClick={()=>setCart([])} style={{
                      fontSize:10.5,color:'#f87171',background:'none',
                      border:'none',cursor:'pointer',padding:0
                    }}>Clear all</button>
                  )}
                </div>

                {cart.length===0 ? (
                  <div style={{
                    textAlign:'center',padding:'20px 0',
                    color:'var(--text-3)',fontSize:13
                  }}>
                    <div style={{fontSize:24,marginBottom:6,opacity:0.3}}>✦</div>
                    No items added yet
                  </div>
                ) : (
                  <div style={{maxHeight:220,overflowY:'auto',paddingRight:2}}>
                    {cart.map(item=>(
                      <div key={item.productId} style={{
                        display:'flex',alignItems:'center',gap:10,
                        padding:'10px 12px',marginBottom:8,
                        background:'var(--bg-2)',borderRadius:'var(--radius-sm)',
                        border:'1px solid var(--border)'
                      }}>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{
                            fontSize:13,fontWeight:500,
                            whiteSpace:'nowrap',overflow:'hidden',
                            textOverflow:'ellipsis'
                          }}>{item.name}</p>
                          <p style={{fontSize:11.5,color:'var(--gold)'}}>
                            ${(item.price*item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:5}}>
                          <button className="qty-btn"
                            onClick={()=>updateQty(item.productId,item.quantity-1)}>−</button>
                          <span style={{
                            fontSize:13,width:22,textAlign:'center',
                            fontWeight:500,color:'var(--text)'
                          }}>{item.quantity}</span>
                          <button className="qty-btn"
                            onClick={()=>updateQty(item.productId,item.quantity+1)}>+</button>
                          <button className="qty-btn" style={{
                            color:'#f87171',borderColor:'rgba(248,113,113,0.2)',marginLeft:2
                          }} onClick={()=>removeFromCart(item.productId)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount */}
              <div className="form-group" style={{marginBottom:10}}>
                <label className="form-label">Discount ($)</label>
                <input className="input" type="number" step="0.01" min="0"
                  value={discount}
                  onChange={e=>setDiscount(parseFloat(e.target.value)||0)} />
              </div>

              {/* Notes */}
              <div className="form-group" style={{marginBottom:16}}>
                <label className="form-label">Notes</label>
                <textarea className="textarea" rows={2}
                  placeholder="Special requests..."
                  value={notes} onChange={e=>setNotes(e.target.value)}
                  style={{resize:'none'}} />
              </div>

              {/* Totals */}
              <div style={{
                background:'var(--bg-2)',borderRadius:'var(--radius-sm)',
                padding:'14px 16px',marginBottom:16,
                border:'1px solid var(--border)'
              }}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--text-2)',marginBottom:7}}>
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--text-2)',marginBottom:7}}>
                  <span>Tax (5%)</span><span>${tax.toFixed(2)}</span>
                </div>
                {discount>0 && (
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#f87171',marginBottom:7}}>
                    <span>Discount</span><span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{
                  height:1,background:'var(--gold-border)',margin:'10px 0 10px'
                }}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{
                    fontFamily:"'Playfair Display',serif",fontSize:16,color:'var(--text)'
                  }}>Total</span>
                  <span style={{
                    fontFamily:"'Playfair Display',serif",fontSize:24,
                    fontWeight:600,color:'var(--gold)'
                  }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button className="btn btn-gold"
                style={{
                  width:'100%',justifyContent:'center',
                  padding:'14px',fontSize:14,letterSpacing:0.5
                }}
                onClick={placeOrder}
                disabled={loading||cart.length===0}>
                {loading ? 'Placing Order...' : '✦  Place Order'}
              </button>
            </div>
          </div>

          {/* Last Order Confirmation */}
          {lastOrder && (
            <div style={{
              marginTop:14,background:'var(--bg-3)',
              border:'1px solid var(--gold-border)',
              borderRadius:'var(--radius)',padding:'18px 20px',
              animation:'fadeIn 0.3s ease'
            }}>
              <div style={{
                display:'flex',alignItems:'center',gap:8,marginBottom:14
              }}>
                <span style={{color:'#4ade80',fontSize:16}}>✓</span>
                <span style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:15,color:'var(--text)'
                }}>Order Confirmed</span>
              </div>
              {[
                {label:'Order ID', value:`#${lastOrder.id}`, gold:true},
                {label:'Total',    value:`$${lastOrder.totalAmount}`, gold:true},
                {label:'Payment',  value: lastOrder.paymentMethod},
              ].map((row,i)=>(
                <div key={i} style={{
                  display:'flex',justifyContent:'space-between',
                  fontSize:13,marginBottom:8
                }}>
                  <span style={{color:'var(--text-3)'}}>{row.label}</span>
                  <span style={{
                    color: row.gold?'var(--gold)':'var(--text)',
                    fontWeight: row.gold?500:400
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}