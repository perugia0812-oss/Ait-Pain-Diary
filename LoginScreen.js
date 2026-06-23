import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { C, PrimaryButton } from './ui';

export default function CompleteScreen({ patient, recordData, onDone }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    saveRecord();
  }, []);

  const saveRecord = async () => {
    try {
      await supabase.from('records').insert({
        patient_id: patient.id,
        nrs_before: recordData.nrs_before,
        nrs_after: recordData.nrs_after,
        timing: recordData.timing,
        duration: recordData.duration,
        pad_count: recordData.pad_count,
        memo: recordData.memo || null,
        goal: recordData.goal || null,
        recorded_at: new Date().toISOString(),
      });
      setSaved(true);
    } catch (e) {
      setError('保存に失敗しました。もう一度お試しください。');
    }
  };

  const diff = (recordData.nrs_before ?? 0) - (recordData.nrs_after ?? 0);

  return (
    <div style={{ minHeight: '100vh', background: C.teal, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {!saved && !error ? (
        <div style={{ textAlign: 'center', color: C.white }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💾</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>保存中...</div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
          <div style={{ color: C.white, marginBottom: 20 }}>{error}</div>
          <PrimaryButton onClick={saveRecord} style={{ background: C.white, color: C.teal }}>再試行</PrimaryButton>
        </div>
      ) : (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 6 }}>記録完了！</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>お疲れ様でした</div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '20px 24px', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>使用前</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: C.white }}>{recordData.nrs_before}</div>
              </div>
              <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>使用後</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: C.white }}>{recordData.nrs_after}</div>
              </div>
            </div>
            {diff > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 20px', display: 'inline-block' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>痛みが {diff} ポイント改善しました 🎉</span>
              </div>
            )}
            {diff === 0 && (
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>継続使用で効果が現れてきます</div>
            )}
          </div>

          {recordData.goal && (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'left' }}>
              <span style={{ fontWeight: 600 }}>目標：</span>{recordData.goal}
            </div>
          )}

          <button onClick={onDone} style={{
            width: '100%', padding: '15px', background: C.white, border: 'none',
            borderRadius: 14, color: C.teal, fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}>
            ホームに戻る
          </button>
        </div>
      )}
    </div>
  );
}
