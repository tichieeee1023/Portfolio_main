import React, { useEffect, useRef } from 'react';

// 각 영문 키워드는 여섯 프로젝트를 고른 이유이므로 원문은 그대로 보존한다.
// 툴팁은 PC에서만 표시하고, 키보드 접근성을 위해 버튼 이름에도 한글 의미를 포함한다.
const CATEGORY_HINTS = {
  'COMMERCE EXPERIENCE': '커머스 사용자 경험',
  'UI SYSTEM': '화면 구성과 UI 설계',
  'INTERACTION': '인터랙션 구현',
  'DATA LOGIC': '데이터 처리 로직',
  'MEDIA CONTENT': '미디어 콘텐츠 구현',
  'SERVICE INTEGRATION': '서비스 기능 연동',
};

export default function WorkIndex({ projects, activeIndex, onSelect }) {
  const itemsRef = useRef(null);
  useEffect(() => {
    const items = itemsRef.current;
    const current = items?.querySelector('[aria-current]');
    if (!current || items.scrollWidth <= items.clientWidth) return;
    const container = items.getBoundingClientRect();
    const button = current.getBoundingClientRect();
    if (button.left < container.left || button.right > container.right) {
      items.scrollTo({ left: items.scrollLeft + button.left - container.left - (container.width - button.width) / 2, behavior: 'instant' });
    }
  }, [activeIndex]);
  return (
    <nav className="work-index" aria-label="WORK INDEX">
      <span className="work-index-label">WORK INDEX</span>
      <div className="work-index-items" ref={itemsRef}>
        {projects.map((project, index) => (
          <button key={project.id} type="button" aria-controls={`project-${project.slug}`}
            aria-label={`${project.id} ${project.indexLabel}, ${CATEGORY_HINTS[project.indexLabel] || ''}: ${project.title.join(' ')}`}
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => onSelect(index)}>
            <span>{project.id}</span> <span className="work-index-title">{project.indexLabel}</span>
            <span className="work-index-tooltip" aria-hidden="true">{CATEGORY_HINTS[project.indexLabel]}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
