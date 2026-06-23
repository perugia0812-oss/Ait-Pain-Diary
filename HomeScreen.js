import React, { useState } from 'react';
import { C, Header, Card, Label, NRSSlider, PrimaryButton, SelectChip } from './ui';

const TIMINGS_DIALYSIS = ['透析前', '透析中'];
const TIMINGS_HOME = ['就寝前', '日中', '起床時', '痛みが強い時'];

export default function BeforeNRSScreen({ patient, onNext, onBack }) {
  const [nrs, setNrs] = useState(5);
  const [timing, setTiming] = useState('');

  const timings = patient?.mode === 'dialysis' ? TIMINGS_DIALYSIS : TIMINGS_HOME;

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Header title="使用前の記録" onBack={onBack} />

      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 14, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#185FA5', fontWeight: 500 }}>
          💡 エイトを装着する前に記録してください
        </div>

        <Card>
          <Label>① 今の痛みの程度（NRS）</Label>
          <NRSSlider value={nrs} onChange={setNrs} />
        </Card>

        <Card>
          <Label>② 使用タイミング</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {timings.map(t => (
              <SelectChip key={t} label={t} selected={timing === t} onToggle={() => setTiming(timing === t ? '' : t)} />
            ))}
          </div>
        </Card>

        <div style={{ marginTop: 8 }}>
          <PrimaryButton onClick={() => onNext({ nrs_before: nrs, timing })} disabled={!timing}>
            エイトを装着しました →
          </PrimaryButton>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: C.gray }}>
            使用タイミングを選んでから次へ進んでください
          </div>
        </div>
      </div>
    </div>
  );
}
