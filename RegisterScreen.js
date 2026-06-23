import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { C, PrimaryButton } from './ui';

export default function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!code.trim() || !patientCode.trim()) {
      setError('施設コードと患者コードを入力してください');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data: facility } = await supabase
        .from('facilities').select('*').eq('facility_code', code.toUpperCase()).single();
      if (!facility) { setError('施設コードが見つかりません'); setLoading(false); return; }

      let { data: patient } = await supabase
        .from('patients').select('*').eq('patient_code', patientCode).eq('facility_id', facility.id).single();

      if (!patient) {
        const { data: newPatient } = await supabase
          .from('patients').insert({ facility_id: facility.id, patient_code: patientCode, mode: facility.mode }).select().single();
        patient = newPatient;
      }
      onLogin({ ...patient, facility });
    } catch (e) {
      setError('ログインに失敗しました。もう一度お試しください。');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.navy, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: C.teal, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>
          🩺
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 6 }}>エイト 痛みの日誌</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Eight Pain Diary</div>
      </div>

      <div style={{ width: '100%', background: C.white, borderRadius: 20, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: C.gray, fontWeight: 500, display: 'block', marginBottom: 6 }}>施設コード</label>
          <input
            value={code} onChange={e => setCode(e.target.value)}
            placeholder="例：DEMO001"
            style={{ width: '100%', padding: '13px 14px', border: `1px solid ${C.grayLt}`, borderRadius: 12, fontSize: 15, outline: 'none', background: C.offWhite }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: C.gray, fontWeight: 500, display: 'block', marginBottom: 6 }}>患者コード</label>
          <input
            value={patientCode} onChange={e => setPatientCode(e.target.value)}
            placeholder="例：P001"
            style={{ width: '100%', padding: '13px 14px', border: `1px solid ${C.grayLt}`, borderRadius: 12, fontSize: 15, outline: 'none', background: C.offWhite }}
          />
        </div>
        {error && <div style={{ fontSize: 13, color: C.red, marginBottom: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 10 }}>{error}</div>}
        <PrimaryButton onClick={handleLogin} disabled={loading}>
          {loading ? '確認中...' : 'ログイン'}
        </PrimaryButton>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: C.gray }}>
          初めての方：施設コード「DEMO001」、患者コード「P001」でお試しいただけます
        </div>
      </div>
    </div>
  );
}
