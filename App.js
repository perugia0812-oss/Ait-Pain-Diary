import React, { useState } from 'react';
import { C, Header, Card, Label, NRSSlider, PrimaryButton, SelectChip } from './ui';

const DURATIONS = ['30分', '60分', 'それ以上'];
const PAD_COUNTS = [1, 2, 3, 4];

export default function AfterNRSScreen({ patient, beforeData, onNext, onBack }) {
  const [nrs, setNrs] = useState(beforeData.nrs_before > 0 ? beforeData.nrs_before - 1 : 0);
  const [duration, setDuration] = useState('30分');
  const [padCount, setPadCount] = useState(4);
  const [memo, setMemo] = useState('');
  const [goal, setGoal] = useState('');

  const diff = beforeData.nrs_before - nrs;

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      <Header title="使用後の記録" onBack={onBack} />

      <div style={{ padding: '20px 16px' }}>
        {/* 使用前の参照表示 */}
        <div style={{ background: C.white, border: `1px solid ${C.grayLt}`, borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.gray }}>使用前NRS</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.red }}>{beforeData.nrs_before}</div>
          </div>
          <div style={{ fontSize: 20, color: C.gray }}>→</div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.gray }}>使用後NRS</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: nrs <= 3 ? C.teal : nrs <= 6 ? C.amber : C.red }}>{nrs}</div>
          </div>
          {diff !== 0 && (
            <div style={{ flex: 1, textAlign: 'center', background: diff > 0 ? C.tealBg : '#FEF2F2', borderRadius: 12, padding: '8px 4px' }}>
              <div style={{ fontSize: 11, color: C.gray }}>改善値</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: diff > 0 ? C.teal : C.red }}>
                {diff > 0 ? `−${diff}` : `+${Math.abs(diff)}`}
              </div>
            </div>
          )}
        </div>

        <Card>
          <Label>① 今の痛みの程度（NRS）</Label>
          <NRSSlider value={nrs} onChange={setNrs} />
        </Card>

        <Card>
          <Label>② 使用時間</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {DURATIONS.map(d => (
              <SelectChip key={d} label={d} selected={duration === d} onToggle={() => setDuration(d)} />
            ))}
          </div>
        </Card>

        <Card>
          <Label>③ 使用したパッドの数</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {PAD_COUNTS.map(n => (
              <SelectChip key={n} label={`${n}個`} selected={padCount === n} onToggle={() => setPadCount(n)} />
            ))}
          </div>
        </Card>

        <Card>
          <Label>④ 感想・変化（任意）</Label>
          <textarea
            value={memo} onChange={e => setMemo(e.target.value)}
            placeholder="例：透析中の痛みが和らいだ。チクチク感が減った。"
            rows={3}
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.grayLt}`, borderRadius: 10, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', color: C.dark }}
          />
        </Card>

        <Card>
          <Label>⑤ 痛みが緩和されたらやりたいこと（任意）</Label>
          <textarea
            value={goal} onChange={e => setGoal(e.target.value)}
            placeholder="例：散歩したい、よく眠りたい"
            rows={2}
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.grayLt}`, borderRadius: 10, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', color: C.dark }}
          />
        </Card>

        <PrimaryButton onClick={() => onNext({ nrs_after: nrs, duration, pad_count: padCount, memo, goal })}>
          記録を完了する ✓
        </PrimaryButton>
      </div>
    </div>
  );
}
