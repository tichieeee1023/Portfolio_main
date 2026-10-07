import React, { useEffect, useRef } from 'react';

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
            aria-label={`${project.id} ${project.indexLabel}: ${project.title.join(' ')}`}
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => onSelect(index)}>
            <span>{project.id}</span> <span className="work-index-title">{project.indexLabel}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
