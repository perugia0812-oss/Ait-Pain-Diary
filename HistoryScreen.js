import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { C, Card, Badge } from './ui';

export default function HomeScreen({ patient, onStartRecord, onHistory, onLogout }) {
  const [todayRecord, setTodayRecord] = useState(null);
  const [stats, setStats] = useState({ count: 0, avgImprove: null, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patient) return;
    loadData();
  }, [patient]);

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data: records } = await supabase
      .from('records').select('*').eq('patient_id', patient.id)
      .order('recorded_at', { ascending: false }).limit(30);

    if (records && records.length > 0) {
      const todayRec = records.find(r => r.recorded_at.startsWith(today));
      setTodayRecord(todayRec || null);

      const withBoth = records.filter(r => r.nrs_before !== null && r.nrs_after !== null);
      const avgImprove = withBoth.length > 0
        ? Math.round((withBoth.reduce((s, r) => s + (r.nrs_before - r.nrs_after), 0) / withBoth.length) * 10) / 10
        : null;

      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 30; i++) {
        const ds = d.toISOString().split('T')[0];
        const found = records.find(r => r.recorded_at.startsWith(ds));
        if (found) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      setStats({ count: records.length, avgImprove, streak });
    }
    setLoading(false);
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'おはようございます' : now.getHours() < 18 ? 'こんにちは' : 'こんばんは';
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日（${'日月火水木金土'[now.getDay()]}）`;

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite }}>
      {/* ヘッダー */}
      <div style={{ background: C.navy, padding: '24px 20px 32px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: C.teal, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🩺</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>エイト日誌</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{patient?.facility?.facility_name || ''}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12, padding: '5px 12px', cursor: 'pointer' }}>
            ログアウト
          </button>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{greeting} 👋</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 4 }}>{dateStr}</div>
        {todayRecord ? (
          <Badge bg="rgba(29,158,117,0.3)" color={C.tealBg}>✓ 今日の記録完了</Badge>
        ) : (
          <Badge bg="rgba(245,158,11,0.25)" color="#FBBF24">今日の記録がまだです</Badge>
        )}
      </div>

      <div style={{ padding: '20px 16px', marginTop: -16 }}>
        {/* 統計カード */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: '累計記録', value: stats.count, unit: '回' },
            { label: '平均改善値', value: stats.avgImprove !== null ? `−${stats.avgImprove}` : '−', unit: 'pt' },
            { label: '連続記録', value: stats.streak, unit: '日' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 14, padding: '12px 10px', textAlign: 'center', border: `1px solid ${C.grayLt}` }}>
              <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>{loading ? '−' : s.value}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* 今日の記録がある場合の表示 */}
        {todayRecord && (
          <Card style={{ background: C.tealBg, border: `1px solid #9FE1CB` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 10 }}>今日の記録</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: C.gray }}>使用前</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.red }}>{todayRecord.nrs_before ?? '−'}</div>
              </div>
              <div style={{ fontSize: 24, color: C.gray }}>→</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: C.gray }}>使用後</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.teal }}>{todayRecord.nrs_after ?? '−'}</div>
              </div>
              {todayRecord.nrs_before !== null && todayRecord.nrs_after !== null && (
                <div style={{ textAlign: 'center', flex: 1, background: C.white, borderRadius: 12, padding: '8px 0' }}>
                  <div style={{ fontSize: 11, color: C.gray }}>改善値</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.teal }}>−{todayRecord.nrs_before - todayRecord.nrs_after}</div>
                </div>
              )}
            </div>
            {todayRecord.memo && <div style={{ marginTop: 10, fontSize: 13, color: '#085041', background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '8px 12px' }}>{todayRecord.memo}</div>}
          </Card>
        )}

        {/* 記録ボタン */}
        <button onClick={onStartRecord} style={{
          width: '100%', padding: '18px', background: C.teal, border: 'none', borderRadius: 18,
          color: C.white, fontSize: 18, fontWeight: 700, cursor: 'pointer', marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          <span style={{ fontSize: 22 }}>📝</span>
          {todayRecord ? '追加で記録する' : '今日の記録を始める'}
        </button>

        <button onClick={onHistory} style={{
          width: '100%', padding: '14px', background: C.white, border: `1px solid ${C.grayLt}`,
          borderRadius: 14, color: C.dark, fontSize: 15, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <span>📊</span> 記録履歴を見る
        </button>
      </div>
    </div>
  );
}
