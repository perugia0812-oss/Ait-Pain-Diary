import React from 'react';

export const C = {
  teal: '#1D9E75',
  tealBg: '#E1F5EE',
  navy: '#1E2761',
  dark: '#1E293B',
  gray: '#64748B',
  grayLt: '#E2E8F0',
  offWhite: '#F7F9FC',
  white: '#FFFFFF',
  amber: '#F59E0B',
  red: '#E24B4A',
  blue: '#378ADD',
  blueBg: '#E6F1FB',
  purple: '#7F77DD',
};

export function Header({ title, onBack, rightAction }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: `1px solid ${C.grayLt}`, padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 8px 8px 0', color: C.gray, fontSize: 20, lineHeight: 1 }}>
          ‹
        </button>
      )}
      <span style={{ flex: 1, fontSize: 17, fontWeight: 600, color: C.dark }}>{title}</span>
      {rightAction}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.grayLt}`, borderRadius: 16, padding: '16px 18px', marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

export function Label({ children, style }) {
  return <div style={{ fontSize: 12, color: C.gray, marginBottom: 6, fontWeight: 500, ...style }}>{children}</div>;
}

export function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '15px', background: disabled ? C.grayLt : C.teal,
      border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', ...style
    }}>
      {children}
    </button>
  );
}

export function NRSSlider({ value, onChange, color }) {
  const getColor = (v) => v <= 3 ? C.teal : v <= 6 ? C.amber : C.red;
  const c = color || getColor(value);
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 64, fontWeight: 700, color: c, lineHeight: 1 }}>{value}</span>
        <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>
          {value === 0 ? '痛みなし' : value <= 3 ? '軽度' : value <= 6 ? '中程度' : value <= 8 ? '強い' : '最も痛い'}
        </div>
      </div>
      <input
        type="range" min={0} max={10} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: c, height: 6, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.gray, marginTop: 4 }}>
        <span>0 痛みなし</span>
        <span>10 最も痛い</span>
      </div>
    </div>
  );
}

export function Badge({ children, color, bg }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: bg || C.tealBg, color: color || C.teal }}>
      {children}
    </span>
  );
}

export function SelectChip({ label, selected, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      padding: '7px 13px', borderRadius: 20, border: `1px solid ${selected ? C.teal : C.grayLt}`,
      background: selected ? C.tealBg : C.white, color: selected ? C.teal : C.gray,
      fontSize: 13, fontWeight: selected ? 600 : 400, cursor: 'pointer', transition: 'all 0.1s'
    }}>
      {label}
    </button>
  );
}
