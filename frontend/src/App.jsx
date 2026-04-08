import { useState, useEffect } from 'react';
import { getItems } from './api/items';
import api from './api/axios';

const CATEGORIES = ['Electronics','Clothing','Accessories','Documents','Keys','Bags','Other'];
const ADMIN_PASSWORD_KEY = 'adminPassword';
const DEFAULT_ADMIN_PASSWORD = 'admin@lostfound123';

const STATUS_STYLES = {
  open:    { light: 'bg-emerald-50 text-emerald-700 border border-emerald-200',    dark: 'bg-emerald-900/30 text-emerald-300 border border-emerald-700' },
  claimed: { light: 'bg-amber-50 text-amber-700 border border-amber-200',          dark: 'bg-amber-900/30 text-amber-300 border border-amber-700' },
  closed:  { light: 'bg-slate-100 text-slate-500 border border-slate-200',         dark: 'bg-slate-800 text-slate-400 border border-slate-600' },
};
const TYPE_STYLES = {
  lost:  { light: 'bg-rose-50 text-rose-700 border border-rose-200',   dark: 'bg-rose-900/30 text-rose-300 border border-rose-700' },
  found: { light: 'bg-sky-50 text-sky-700 border border-sky-200',      dark: 'bg-sky-900/30 text-sky-300 border border-sky-700' },
};

function getGenericImage(title, category) {
  const t = title.toLowerCase();
  const itemMap = [
    { words: ['airpod','earpod','earbud','headphone','earphone'], url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80' },
    { words: ['phone','mobile','iphone','samsung','oneplus','oppo','vivo','redmi'], url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
    { words: ['laptop','macbook','computer','notebook'], url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
    { words: ['charger','cable','adapter'], url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80' },
    { words: ['watch','smartwatch'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { words: ['wallet','purse'], url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80' },
    { words: ['ring','band','bangle'], url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
    { words: ['necklace','chain','pendant'], url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
    { words: ['bracelet'], url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
    { words: ['earring'], url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80' },
    { words: ['glasses','spectacles','sunglasses','specs'], url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80' },
    { words: ['bag','backpack','satchel','handbag','tote'], url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
    { words: ['book','notebook','diary','journal'], url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
    { words: ['id','card','identity','student'], url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&q=80' },
    { words: ['key','keychain'], url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { words: ['umbrella'], url: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=400&q=80' },
    { words: ['bottle','waterbottle','flask','sipper'], url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80' },
    { words: ['calculator'], url: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&q=80' },
    { words: ['pen','pencil','marker'], url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80' },
    { words: ['jacket','hoodie','sweater','coat'], url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80' },
    { words: ['shirt','tshirt','top'], url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
    { words: ['shoe','sandal','slipper','boot'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { words: ['camera','dslr'], url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
    { words: ['tablet','ipad'], url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
    { words: ['powerbank','power bank'], url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80' },
    { words: ['passport'], url: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400&q=80' },
    { words: ['bicycle','cycle','bike'], url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80' },
    { words: ['guitar','instrument'], url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80' },
  ];
  const fallbacks = {
    Electronics:'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80',
    Clothing:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80',
    Accessories:'https://images.unsplash.com/photo-1609873814058-a8928924184a?w=400&q=80',
    Documents:'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
    Keys:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    Bags:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    Other:'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80',
  };
  for (const e of itemMap) { if (e.words.some(w=>t.includes(w))) return e.url; }
  return fallbacks[category] || fallbacks.Other;
}

function useDark() {
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('darkMode', dark);
  }, [dark]);
  return [dark, setDark];
}

function Badge({ type, value, dark }) {
  const styles = type === 'status' ? STATUS_STYLES : TYPE_STYLES;
  const s = styles[value] || styles[Object.keys(styles)[0]];
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dark ? s.dark : s.light}`}>{value}</span>;
}

function DarkToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)}
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all border ${dark ? 'bg-slate-700 border-slate-600 text-yellow-300' : 'bg-white border-slate-200 text-slate-600'}`}>
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

function GlassCard({ children, className = '', dark }) {
  return (
    <div className={`rounded-2xl border backdrop-blur-sm ${dark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/70 border-white/60 shadow-sm'} ${className}`}>
      {children}
    </div>
  );
}

function ImageViewer({ urls, baseUrl = 'http://127.0.0.1:8000' }) {
  const [lightbox, setLightbox] = useState(null);
  const list = (urls || '').split(',').filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      <div className="flex gap-2 flex-wrap mt-2">
        {list.map((url, i) => (
          <div key={i} onClick={() => setLightbox(`${baseUrl}${url}`)} className="relative cursor-pointer group">
            <img src={`${baseUrl}${url}`} className="w-16 h-16 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-lg">view</span>
            </div>
          </div>
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" style={{position:'fixed'}} onClick={() => setLightbox(null)}>
          <img src={lightbox} style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:16,objectFit:'contain'}} />
          <button onClick={() => setLightbox(null)} style={{position:'absolute',top:16,right:16,width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.15)',color:'#fff',fontSize:20,fontWeight:'bold',border:'none',cursor:'pointer'}}>×</button>
        </div>
      )}
    </>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [dark, setDark] = useDark();
  const [items, setItems]       = useState([]);
  const [claims, setClaims]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType]     = useState('');
  const [toast, setToast]       = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credMsg, setCredMsg]   = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),3000); };

  const bg    = dark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const card  = dark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/70 border-white/60 shadow-sm';
  const input = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';
  const hdr   = dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200';

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { 'X-User-Id': 'admin' };
      const [iRes, cRes] = await Promise.all([
        api.get('/admin/items', { headers }),
        api.get('/admin/claims', { headers }),
      ]);
      setItems(iRes.data);
      setClaims(cRes.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const logout = () => { localStorage.removeItem('adminLoggedIn'); window.location.reload(); };

  const changeStatus = async (id, status) => {
    try {
      const headers = { 'X-User-Id': 'admin' };
      if (status === 'deleted') {
        await api.delete(`/admin/items/${id}`, { headers });
        setItems(p => p.filter(i => i.id !== id));
        showToast('🗑️ Report deleted');
      } else if (status === 'closed') {
        await api.patch(`/admin/items/${id}/close`, {}, { headers });
        setItems(p => p.map(i => i.id === id ? {...i, status:'closed'} : i));
        showToast('✅ Marked as closed');
      } else {
        await api.patch(`/admin/items/${id}`, { status }, { headers });
        setItems(p => p.map(i => i.id === id ? {...i, status} : i));
        showToast('✅ Status updated');
      }
    } catch(e) { showToast('❌ ' + (e.response?.data?.detail || e.message)); }
  };

  const reviewClaim = async (claimId, itemId, status) => {
    try {
      await api.patch(`/admin/claims/${claimId}/review`, { status }, { headers: { 'X-User-Id':'admin' } });
      setClaims(p => p.map(c => c.id === claimId ? {...c, status} : c));
      if (status === 'approved') setItems(p => p.map(i => i.id === itemId ? {...i, status:'closed'} : i));
      else setItems(p => p.map(i => i.id === itemId ? {...i, status:'open'} : i));
      showToast(status === 'approved' ? '✅ Claim approved — item closed' : '❌ Claim rejected');
    } catch(e) { showToast('❌ Error reviewing claim'); }
  };

  const saveCredentials = () => {
    if (!newPassword || newPassword.length < 6) { setCredMsg('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setCredMsg('Passwords do not match'); return; }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    setCredMsg('✅ Password updated successfully!');
    setNewPassword(''); setConfirmPassword('');
    setTimeout(() => { setShowCredentials(false); setCredMsg(''); }, 1500);
  };

  const filtered = items.filter(item => {
    const s = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.reporter_name?.toLowerCase().includes(search.toLowerCase()) || item.location?.toLowerCase().includes(search.toLowerCase());
    return s && (!filterStatus || item.status === filterStatus) && (!filterType || item.type === filterType);
  });

  const pendingCount = claims.filter(c => c.status === 'pending').length;

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <style>{`
        * { box-sizing: border-box; }
        .glass { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      {/* Header */}
      <header className={`glass sticky top-0 z-40 border-b ${hdr}`}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <img src="/logo.png" alt="Lost & Found" className="h-10 w-10 object-contain rounded-xl" />
          <div>
            <span className={`font-black text-base leading-none block ${dark ? 'text-white' : 'text-slate-900'}`}>Lost &amp; Found</span>
            <span className={`text-xs leading-none ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Management System</span>
          </div>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
          <div className="flex-1" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reports..."
            className={`w-52 border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${input}`} />
          <DarkToggle dark={dark} setDark={setDark} />
          <button onClick={() => setShowCredentials(true)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${dark ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            ⚙️ Settings
          </button>
          <button onClick={logout}
            className="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors">
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ['Total', items.length, 'from-violet-500 to-indigo-500'],
            ['Open', items.filter(i=>i.status==='open').length, 'from-emerald-500 to-teal-500'],
            ['Pending', pendingCount, 'from-amber-500 to-orange-500'],
            ['Closed', items.filter(i=>i.status==='closed').length, 'from-slate-400 to-slate-500'],
          ].map(([l,v,g])=>(
            <div key={l} className={`glass rounded-2xl border p-4 text-center ${card}`}>
              <div className={`text-3xl font-black bg-gradient-to-r ${g} bg-clip-text text-transparent`}>{v}</div>
              <div className={`text-xs uppercase font-semibold mt-1 ${muted}`}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={`glass rounded-2xl border p-3 mb-5 flex gap-2 flex-wrap ${card}`}>
          {[
            ['filterType', filterType, setFilterType, [['','All types'],['lost','Lost'],['found','Found']]],
            ['filterStatus', filterStatus, setFilterStatus, [['','All status'],['open','Open'],['claimed','Claimed'],['closed','Closed']]],
          ].map(([key, val, setter, opts]) => (
            <select key={key} value={val} onChange={e=>setter(e.target.value)}
              className={`border rounded-xl px-3 py-1.5 text-sm focus:outline-none ${input}`}>
              {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <span className={`text-sm self-center ml-auto ${muted}`}>{filtered.length} reports</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 ${muted}`}>No reports found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => {
              const itemClaims = claims.filter(c => c.item_id === item.id);
              const isExpanded = expandedItem === item.id;
              const isLost = item.type === 'lost';
              const submissionLabel = isLost ? 'submission' : 'claim';
              const submissionsLabel = isLost ? 'submissions' : 'claims';

              return (
                <div key={item.id} className={`glass rounded-2xl border overflow-hidden ${card}`}>
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img src={getGenericImage(item.title, item.category)} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className={`font-bold text-base ${dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <Badge type="type" value={item.type} dark={dark} />
                            <Badge type="status" value={item.status} dark={dark} />
                          </div>
                        </div>
                        <div className={`text-xs space-y-0.5 mb-2 ${muted}`}>
                          <div>📍 {item.location} · 🏷️ {item.category} · 📅 {item.date}</div>
                          {item.reporter_name && (
                            <div className={`font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                              👤 {item.reporter_name} · 📧 {item.reporter_email} · 📞 {item.reporter_phone}
                            </div>
                          )}
                        </div>
                        {item.description && (
                          <div className={`rounded-xl px-3 py-2 text-xs italic mb-2 ${dark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                            📝 "{item.description}"
                          </div>
                        )}
                        {item.image_urls && (
                          <div>
                            <div className={`text-xs font-semibold mb-1 ${muted}`}>Reporter photos:</div>
                            <ImageViewer urls={item.image_urls} />
                          </div>
                        )}
                        <div className="flex gap-2 mt-3 flex-wrap items-center">
                          {item.status !== 'open' && (
                            <button onClick={()=>changeStatus(item.id,'open')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100">Mark open</button>
                          )}
                          {item.status !== 'claimed' && (
                            <button onClick={()=>changeStatus(item.id,'claimed')} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200 hover:bg-amber-100">Mark claimed</button>
                          )}
                          {item.status !== 'closed' && (
                            <button onClick={()=>changeStatus(item.id,'closed')} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100">Mark closed</button>
                          )}
                          <button onClick={()=>{ if(window.confirm('Delete this report permanently?')) changeStatus(item.id,'deleted'); }}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg border border-rose-200 hover:bg-rose-100">
                            🗑️ Delete
                          </button>
                          <div className="ml-auto">
                            {itemClaims.length > 0 ? (
                              <button onClick={()=>setExpandedItem(isExpanded ? null : item.id)}
                                className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg border border-violet-200 hover:bg-violet-100">
                                {isExpanded ? '▲ Hide' : '▼ View'} {itemClaims.length} {submissionsLabel}
                              </button>
                            ) : (
                              <span className={`text-xs ${muted}`}>No {submissionsLabel} yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && itemClaims.length > 0 && (
                    <div className={`border-t p-4 space-y-3 ${dark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
                      <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${muted}`}>
                        {isLost ? 'Found submissions' : 'Ownership claims'} for this report
                      </div>
                      {itemClaims.map(claim => (
                        <div key={claim.id} className={`rounded-xl border p-3 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className={`text-xs ${muted}`}>📅 {claim.created_at?.split('T')[0]}</div>
                            <Badge type="status" value={claim.status} dark={dark} />
                          </div>
                          <div className={`rounded-lg px-3 py-2 text-sm mb-2 leading-relaxed ${dark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                            {claim.proof_description}
                          </div>
                          {claim.proof_image_url && (
                            <div>
                              <div className={`text-xs font-semibold mb-1 ${muted}`}>Evidence photos:</div>
                              <ImageViewer urls={claim.proof_image_url} />
                            </div>
                          )}
                          {claim.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <button onClick={()=>reviewClaim(claim.id,item.id,'approved')}
                                className="flex-1 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-200 hover:bg-emerald-100">
                                ✓ Approve & close item
                              </button>
                              <button onClick={()=>reviewClaim(claim.id,item.id,'rejected')}
                                className="flex-1 py-2 bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 hover:bg-rose-100">
                                ✗ Reject
                              </button>
                            </div>
                          )}
                          {claim.status !== 'pending' && (
                            <div className={`text-center text-xs font-semibold py-2 rounded-xl mt-2 ${claim.status==='approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {claim.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Change Credentials Modal */}
      {showCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{position:'fixed'}}>
          <div className={`rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <h2 className={`font-black text-xl mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>Change Password</h2>
            <p className={`text-sm mb-5 ${muted}`}>Update your admin login password</p>
            {credMsg && (
              <div className={`text-sm p-3 rounded-xl mb-4 ${credMsg.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {credMsg}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-semibold mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${input}`} />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${input}`} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>{ setShowCredentials(false); setCredMsg(''); setNewPassword(''); setConfirmPassword(''); }}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                Cancel
              </button>
              <button onClick={saveCredentials}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700">
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg z-50 whitespace-nowrap" style={{position:'fixed'}}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function AdminLoginModal({ onSuccess, onClose, dark }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleLogin = () => {
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
    if (password === stored) { onSuccess(); }
    else { setError('Incorrect password. Try again.'); setPassword(''); }
  };

  const card = dark ? 'bg-slate-800 border border-slate-700' : 'bg-white';
  const input = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{position:'fixed'}}>
      <div className={`rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl ${card}`}>
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Lost & Found" className="w-14 h-14 object-contain mx-auto mb-3 rounded-2xl" />          <h2 className={`font-black text-xl ${dark ? 'text-white' : 'text-slate-900'}`}>Admin Access</h2>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Enter password to continue</p>
        </div>
        {error && <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-xl mb-4">{error}</div>}
        <input type="password" value={password}
          onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && handleLogin()}
          placeholder="Admin password"
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 mb-3 ${input}`}
          autoFocus />
        <button onClick={handleLogin} className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity mb-2">
          Login as Admin
        </button>
        <button onClick={onClose} className={`w-full py-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-400'}`}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Report Form ──────────────────────────────────────────────────────────────
function ReportForm({ onSubmit, onCancel, dark }) {
  const [form, setForm] = useState({ reporter_name:'', reporter_email:'', reporter_phone:'', title:'', description:'', category:'Electronics', location:'', date: new Date().toISOString().split('T')[0], type:'lost' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inp = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
  const lbl = dark ? 'text-slate-300' : 'text-slate-700';
  const handleImages = (e) => { const f=Array.from(e.target.files).slice(0,5); setImages(f); setPreviews(f.map(x=>URL.createObjectURL(x))); };

  const handleSubmit = async () => {
    if (!form.reporter_name)          { setError('Name is required'); return; }
    if (!form.reporter_email)         { setError('Email is required'); return; }
    if (!form.reporter_phone)         { setError('Phone is required'); return; }
    if (form.title.length < 3)        { setError('Title must be at least 3 characters'); return; }
    if (form.description.length < 10) { setError('Description must be at least 10 characters'); return; }
    if (!form.location.trim())        { setError('Location is required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      images.forEach(img => fd.append('images', img));
      await onSubmit(fd);
    } catch(e) { setError(e.response?.data?.detail || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-xl border border-rose-100">{error}</div>}
      <div className={`rounded-xl p-3 border ${dark ? 'bg-violet-900/20 border-violet-700/30' : 'bg-violet-50 border-violet-100'}`}>
        <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${dark ? 'text-violet-300' : 'text-violet-700'}`}>Your contact info</p>
        <div className="space-y-3">
          <div>
            <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Full Name *</label>
            <input value={form.reporter_name} onChange={e=>setForm(p=>({...p,reporter_name:e.target.value}))} placeholder="e.g. Rahul Sharma" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Email *</label>
              <input type="email" value={form.reporter_email} onChange={e=>setForm(p=>({...p,reporter_email:e.target.value}))} placeholder="you@college.edu" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Phone *</label>
              <input type="tel" value={form.reporter_phone} onChange={e=>setForm(p=>({...p,reporter_phone:e.target.value}))} placeholder="9876543210" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Item title *</label>
        <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Blue AirPods Pro" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Description *</label>
        <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Describe unique features, color, brand, serial number..." className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none ${inp}`} />
        <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Private — only visible to admin</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Category</label>
          <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${inp}`}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Location *</label>
          <input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Library 2nd floor" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Date</label>
          <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${inp}`} />
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Type</label>
          <div className="flex gap-2">
            {['lost','found'].map(t=>(
              <button key={t} onClick={()=>setForm(p=>({...p,type:t}))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border-2 transition-all ${form.type===t ? t==='lost' ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-sky-400 bg-sky-50 text-sky-700' : dark ? 'border-slate-600 text-slate-400' : 'border-slate-200 text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Images (max 5)</label>
        <input type="file" accept="image/*" multiple onChange={handleImages} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-violet-50 file:text-violet-700 file:font-semibold" />
        {previews.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">{previews.map((p,i)=><img key={i} src={p} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />)}</div>}
        <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Private — only visible to admin</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${dark ? 'border-slate-600 text-slate-300' : 'border-slate-200 text-slate-500'}`}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">{loading?'Submitting...':'Submit report'}</button>
      </div>
    </div>
  );
}

// ─── Claim Form ───────────────────────────────────────────────────────────────
function ClaimForm({ item, type, onSubmit, onCancel, dark }) {
  const itemType = type || 'found';
  const isFound  = itemType === 'lost';
  const [form, setForm] = useState({ claimant_name:'', claimant_email:'', claimant_phone:'', proof_description:'' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inp = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
  const lbl = dark ? 'text-slate-300' : 'text-slate-700';
  const handleImages = (e) => { const f=Array.from(e.target.files).slice(0,3); setImages(f); setPreviews(f.map(x=>URL.createObjectURL(x))); };

  const handleSubmit = async () => {
    if (!form.claimant_name)                       { setError('Name is required'); return; }
    if (!form.claimant_email)                      { setError('Email is required'); return; }
    if (!form.claimant_phone)                      { setError('Phone is required'); return; }
    if (form.proof_description.trim().length < 20) { setError('Please write at least 20 characters'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('proof_description', `Name: ${form.claimant_name} | Email: ${form.claimant_email} | Phone: ${form.claimant_phone} | ${isFound?'Found Report':'Claim'}: ${form.proof_description}`);
      images.forEach(img => fd.append('proof_image', img));
      await onSubmit(fd);
    } catch(e) { setError(e.response?.data?.detail || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-xl p-3 border ${dark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
        <div className={`text-xs uppercase font-bold mb-1 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{isFound ? 'Submitting found report for' : 'Submitting claim for'}</div>
        <div className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
        <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>📍 {item.location}</div>
      </div>
      <div className={`rounded-xl p-3 border ${dark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-100'}`}>
        <p className={`text-xs font-semibold ${dark ? 'text-amber-300' : 'text-amber-700'}`}>🔒 Your information and evidence are private — only the admin can see them.</p>
      </div>
      {error && <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-xl">{error}</div>}
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Your full name *</label>
        <input value={form.claimant_name} onChange={e=>setForm(p=>({...p,claimant_name:e.target.value}))} placeholder="e.g. Rahul Sharma" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Email *</label>
          <input type="email" value={form.claimant_email} onChange={e=>setForm(p=>({...p,claimant_email:e.target.value}))} placeholder="you@college.edu" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-1 ${lbl}`}>Phone *</label>
          <input type="tel" value={form.claimant_phone} onChange={e=>setForm(p=>({...p,claimant_phone:e.target.value}))} placeholder="9876543210" className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
        </div>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>{isFound ? 'Where did you find it? *' : 'Proof of ownership *'}</label>
        <textarea value={form.proof_description} onChange={e=>setForm(p=>({...p,proof_description:e.target.value}))} rows={4} placeholder={isFound?"Describe where and when you found it...":"Describe unique details only the owner would know..."} className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none ${inp}`} />
        <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Minimum 20 characters · Only admin can see this</p>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-1 ${lbl}`}>{isFound ? '📸 Photos of found item (max 3)' : '📸 Evidence photos (max 3)'}</label>
        <input type="file" accept="image/*" multiple onChange={handleImages} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-violet-50 file:text-violet-700 file:font-semibold" />
        {previews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((p,i)=>(
              <div key={i} className="relative">
                <img src={p} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                <span className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{i+1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${dark ? 'border-slate-600 text-slate-300' : 'border-slate-200 text-slate-500'}`}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-bold disabled:opacity-50">{loading?'Submitting...':isFound?'Submit found report':'Submit claim'}</button>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose, dark }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" style={{position:'fixed'}} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className={`rounded-t-3xl w-full max-w-lg max-h-[90vh] flex flex-col ${dark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className={`flex justify-between items-center px-6 py-4 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>×</button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDismiss }) {
  useEffect(()=>{ const t=setTimeout(onDismiss,3000); return()=>clearTimeout(t); },[]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl z-50 whitespace-nowrap border border-slate-700" style={{position:'fixed'}}>
      {message}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useDark();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState('');
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({ type:'', status:'', category:'' });
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  if (isAdmin) return <AdminPanel />;

  const bg   = dark ? 'bg-slate-900' : 'bg-slate-50';
  const hdr  = dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200';
  const card = dark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/70 border-white/60 shadow-sm';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';
  const inp  = dark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800';

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type)     params.type     = filters.type;
      if (filters.status)   params.status   = filters.status;
      if (filters.category) params.category = filters.category;
      const res = await getItems(params);
      setItems(res.data.items);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchItems(); }, [filters]);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.trim() === 'AdminLogin') { setSearch(''); setShowAdminLogin(true); }
  };

  const filtered = items.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()));

  const handleReportSubmit = async (fd) => {
    const { reportItem } = await import('./api/items');
    await reportItem(fd);
    setModal(null);
    setToast('✅ Item reported successfully!');
    fetchItems();
  };

  const handleClaimSubmit = async (fd) => {
    const { submitClaim } = await import('./api/claims');
    await submitClaim(selected.id, fd);
    setModal(null);
    setSelected(null);
    setToast('🙋 Submitted — admin will contact you soon');
    fetchItems();
  };

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <style>{`
        * { box-sizing: border-box; }
        .glass { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>

      {/* Header */}
      <header className={`glass sticky top-0 z-40 border-b ${hdr}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Lost & Found" className="h-9 w-9 object-contain rounded-xl" />
            <div>
              <span className={`font-black text-base leading-none block ${dark ? 'text-white' : 'text-slate-900'}`}>Admin Dashboard</span>
              <span className={`text-xs leading-none ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Lost &amp; Found System</span>
            </div>
          </div>
          <input value={search} onChange={e=>handleSearch(e.target.value)}
            placeholder="Search items..."
            className={`flex-1 max-w-xs border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${inp}`} />
          <div className="flex items-center gap-2">
            <DarkToggle dark={dark} setDark={setDark} />
            <button onClick={()=>setModal('report')}
              className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              + Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            ['Total', items.length, 'from-violet-500 to-indigo-500'],
            ['Lost',  items.filter(i=>i.type==='lost').length,  'from-rose-500 to-pink-500'],
            ['Found', items.filter(i=>i.type==='found').length, 'from-sky-500 to-blue-500'],
            ['Closed',items.filter(i=>i.status==='closed').length,'from-slate-400 to-slate-500'],
          ].map(([l,v,g])=>(
            <div key={l} className={`glass rounded-2xl border p-3 text-center ${card}`}>
              <div className={`text-2xl font-black bg-gradient-to-r ${g} bg-clip-text text-transparent`}>{v}</div>
              <div className={`text-xs uppercase font-semibold mt-1 ${muted}`}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={`glass rounded-2xl border p-3 mb-5 flex flex-wrap gap-2 ${card}`}>
          <select value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value}))} className={`border rounded-xl px-3 py-1.5 text-sm focus:outline-none ${inp}`}>
            <option value="">All types</option><option value="lost">Lost</option><option value="found">Found</option>
          </select>
          <select value={filters.status} onChange={e=>setFilters(p=>({...p,status:e.target.value}))} className={`border rounded-xl px-3 py-1.5 text-sm focus:outline-none ${inp}`}>
            <option value="">All status</option><option value="open">Open</option><option value="claimed">Claimed</option><option value="closed">Closed</option>
          </select>
          <select value={filters.category} onChange={e=>setFilters(p=>({...p,category:e.target.value}))} className={`border rounded-xl px-3 py-1.5 text-sm focus:outline-none ${inp}`}>
            <option value="">All categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 ${muted}`}>
            <div className="text-5xl mb-3">🔍</div>
            <div className={`font-bold mb-1 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>No items found</div>
            <div className="text-sm">Try adjusting your filters</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item=>(
              <div key={item.id} onClick={()=>{ setSelected(item); setModal('detail'); }}
                className={`glass rounded-2xl border cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${card}`}>
                <img src={getGenericImage(item.title, item.category)} alt={item.category} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className={`font-bold text-sm leading-tight flex-1 truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                    <Badge type="type" value={item.type} dark={dark} />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs ${muted}`}>📍 {item.location}</span>
                    <Badge type="status" value={item.status} dark={dark} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {modal==='detail' && selected && (
        <Modal title="Item details" onClose={()=>{ setModal(null); setSelected(null); }} dark={dark}>
          <img src={getGenericImage(selected.title, selected.category)} alt={selected.category} className="w-full h-44 object-cover rounded-2xl mb-4" />
          <div className="flex justify-between items-start gap-2 mb-3">
            <h2 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{selected.title}</h2>
            <div className="flex gap-2 flex-shrink-0">
              <Badge type="type" value={selected.type} dark={dark} />
              <Badge type="status" value={selected.status} dark={dark} />
            </div>
          </div>
          <div className={`grid grid-cols-2 gap-3 rounded-xl p-4 mb-4 ${dark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            {[['📍 Location', selected.location],['🏷️ Category', selected.category],['📅 Date', selected.date]].map(([l,v])=>(
              <div key={l}>
                <div className={`text-xs uppercase font-bold ${muted}`}>{l}</div>
                <div className={`text-sm font-semibold mt-1 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{v}</div>
              </div>
            ))}
          </div>
          <div className={`rounded-xl p-3 mb-4 border ${dark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-100'}`}>
            <p className={`text-xs font-semibold ${dark ? 'text-amber-300' : 'text-amber-700'}`}>🔒 Item details are kept private to prevent false claims. If this is yours, submit below.</p>
          </div>
          {selected.status === 'open' && (
            <button onClick={()=>setModal('claim')}
              className={`w-full py-3 font-bold rounded-xl text-white transition-all hover:opacity-90 ${selected.type==='found' ? 'bg-gradient-to-r from-violet-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
              {selected.type==='found' ? '🙋 This is mine — Submit a claim' : '✋ I found this — Submit info'}
            </button>
          )}
          {selected.status !== 'open' && (
            <div className={`w-full py-3 rounded-xl text-center text-sm font-semibold ${dark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              This item is {selected.status} — no longer accepting submissions
            </div>
          )}
        </Modal>
      )}

      {modal==='report' && (
        <Modal title="Report an item" onClose={()=>setModal(null)} dark={dark}>
          <ReportForm onSubmit={handleReportSubmit} onCancel={()=>setModal(null)} dark={dark} />
        </Modal>
      )}

      {modal==='claim' && selected && (
        <Modal title={selected.type==='found' ? 'Submit ownership claim' : 'Report found item'} onClose={()=>setModal('detail')} dark={dark}>
          <ClaimForm item={selected} type={selected.type} onSubmit={handleClaimSubmit} onCancel={()=>setModal('detail')} dark={dark} />
        </Modal>
      )}

      {showAdminLogin && (
        <AdminLoginModal
          dark={dark}
          onSuccess={()=>{ localStorage.setItem('adminLoggedIn','true'); setShowAdminLogin(false); window.location.reload(); }}
          onClose={()=>setShowAdminLogin(false)}
        />
      )}

      {toast && <Toast message={toast} onDismiss={()=>setToast('')} />}
    </div>
  );
}