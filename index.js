import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { C, Header, Card } from './ui';

export default function HistoryScreen({ patient, onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [patient]);

  const loadRecords = async () => {
    const { data } = await supabase
      .from('records').select('*').eq('patient_id', patient.id)
      .order('recorded_at', { ascending: false }).limit(50);
    setRecords(data || []);
    setLoading(false);
  };

  const withBoth = records.filter(r => r.nrs_before !== null && r.nrs_after !== null);
  const avgImprove = withBoth.length > 0
    ? Math.round(withBoth.reduce((s, r) => s + (r.nrs_before - r.nrs_after), 0) / withBoth.length * 10) / 10
    : null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}（${'日月火水木金土'[d.getDay()]}）`;
  };

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite }}>
      <Header title="記録履歴" onBack={onBack} />

      <div style={{ padding: '16px' }}>
        {/* 集計 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: C.white, borderRadius: 14, padding: '14px', textAlign: 'center', border: `1px solid ${C.grayLt}` }}>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>累計記録数</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.navy }}>{records.length}</div>
            <div style={{ fontSize: 11, color: C.gray }}>回</div>
          </div>
          <div style={{ background: C.white, borderRadius: 14, padding: '14px', textAlign: 'center', border: `1px solid ${C.grayLt}` }}>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>平均NRS改善値</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.teal }}>{avgImprove !== null ? `−${avgImprove}` : '−'}</div>
            <div style={{ fontSize: 11, color: C.gray }}>ポイント</div>
          </div>
        </div>

        {/* NRS推移グラフ（簡易） */}
        {withBoth.length > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 12 }}>NRS推移（直近{Math.min(withBoth.length, 10)}回）</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
              {withBoth.slice(0, 10).reverse().map((r, i) => {
                const beforeH = (r.nrs_before / 10) * 70;
                const afterH = (r.nrs_after / 10) * 70;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 70 }}>
                      <div style={{ flex: 1, background: '#FEE2E2', borderRadius: '3px 3px 0 0', height: beforeH }} />
                      <div style={{ flex: 1, background: C.tealBg, borderRadius: '3px 3px 0 0', height: afterH }} />
                    </div>
                    <div style={{ fontSize: 9, color: C.gray }}>{formatDate(r.recorded_at).split('（')[0]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: C.gray }}>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#FEE2E2', borderRadius: 2, marginRight: 4 }} />使用前</span>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, background: C.tealBg, borderRadius: 2, marginRight: 4 }} />使用後</span>
            </div>
          </Card>
        )}

        {/* 記録リスト */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 10 }}>記録一覧</div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.gray }}>読み込み中...</div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.gray }}>まだ記録がありません</div>
        ) : (
          records.map(r => {
            const diff = (r.nrs_before ?? 0) - (r.nrs_after ?? 0);
            return (
              <Card key={r.id} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{formatDate(r.recorded_at)}</div>
                  {r.timing && <span style={{ fontSize: 11, background: C.blueBg, color: C.blue, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{r.timing}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: C.gray }}>前</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: C.red }}>{r.nrs_before ?? '−'}</div>
                  </div>
                  <div style={{ color: C.gray }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: C.gray }}>後</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: C.teal }}>{r.nrs_after ?? '−'}</div>
                  </div>
                  {r.nrs_before !== null && r.nrs_after !== null && (
                    <div style={{ marginLeft: 'auto', background: diff > 0 ? C.tealBg : diff < 0 ? '#FEF2F2' : C.offWhite, borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: C.gray }}>改善</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: diff > 0 ? C.teal : diff < 0 ? C.red : C.gray }}>
                        {diff > 0 ? `−${diff}` : diff < 0 ? `+${Math.abs(diff)}` : '±0'}
                      </div>
                    </div>
                  )}
                </div>
                {r.memo && <div style={{ marginTop: 8, fontSize: 12, color: C.gray, borderTop: `1px solid ${C.grayLt}`, paddingTop: 8 }}>{r.memo}</div>}
                <div style={{ marginTop: 6, display: 'flex', gap: 8, fontSize: 11, color: C.gray }}>
                  {r.duration && <span>⏱ {r.duration}</span>}
                  {r.pad_count && <span>📡 {r.pad_count}パッド</span>}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
