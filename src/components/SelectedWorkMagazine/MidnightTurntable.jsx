export default function MidnightTurntable({ active }) {
  return (
    <div className={`turntable ${active ? 'is-active' : ''}`} role="img" aria-label="장식용 턴테이블 애니메이션. 오디오는 재생되지 않습니다.">
      <div className="turntable-inner">
        <span className="record" aria-hidden="true"><span>MC</span></span>
        <span className="tone-arm" aria-hidden="true" />
        <span className="turntable-copy">
          <span className="turntable-episode"><b>미드나잇 25시 정각</b><span>수고했어, 오늘도 빛난 당신에게</span></span>
        </span>
        <span className="equalizer" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} style={{ '--bar': i }} />)}</span>
      </div>
    </div>
  );
}
