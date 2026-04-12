import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { publicApi, adminApi } from '../api';
import Flag from '../components/Flags';
import SectionPreview from './SectionPreview';
import SectionEditor from './SectionEditor';
import AddSectionModal from './AddSectionModal';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'am', label: 'AM' },
];

const AdminPageEditor = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [addAtIndex, setAddAtIndex] = useState(null);
  const [lang, setLang] = useState('en');

  const loadPage = useCallback(() => {
    setLoading(true);
    publicApi.getPage(slug, lang)
      .then(({ data }) => {
        setPage(data);
        setSections(data.sections || []);
      })
      .finally(() => setLoading(false));
  }, [slug, lang]);

  useEffect(() => { loadPage(); }, [loadPage]);

  const handleDelete = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    await adminApi.deleteSection(sectionId);
    loadPage();
  };

  const handleMoveUp = async (section, index) => {
    if (index === 0) return;
    const prev = sections[index - 1];
    await adminApi.reorderSection(section.id, prev.order);
    await adminApi.reorderSection(prev.id, section.order);
    loadPage();
  };

  const handleMoveDown = async (section, index) => {
    if (index === sections.length - 1) return;
    const next = sections[index + 1];
    await adminApi.reorderSection(section.id, next.order);
    await adminApi.reorderSection(next.id, section.order);
    loadPage();
  };

  const handleSectionSaved = () => {
    setEditingSection(null);
    setAddAtIndex(null);
    loadPage();
  };

  if (loading) return <div className="admin-loading">Loading page...</div>;
  if (!page) return <div className="admin-empty">Page not found</div>;

  return (
    <div className="admin-page-editor">
      <div className="admin-page-editor__header">
        <h1 className="admin-page-editor__title">{page.title}</h1>
        <div className="admin-lang-tabs">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`admin-lang-tab ${lang === l.code ? 'admin-lang-tab--active' : ''}`}
              onClick={() => setLang(l.code)}
            >
              <Flag code={l.code} /> {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-page-editor__sections">
        <AddButton onClick={() => setAddAtIndex(0)} label="Add section at top" />

        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            <div className="admin-section-wrapper">
              <div className="admin-section-toolbar">
                <span className="admin-section-toolbar__type">{section.section_type}</span>
                <span className="admin-section-toolbar__title">{section.title}</span>
                <div className="admin-section-toolbar__actions">
                  <button onClick={() => handleMoveUp(section, index)} disabled={index === 0} title="Move up">
                    <FiChevronUp />
                  </button>
                  <button onClick={() => handleMoveDown(section, index)} disabled={index === sections.length - 1} title="Move down">
                    <FiChevronDown />
                  </button>
                  <button onClick={() => setEditingSection(section)} title="Edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(section.id)} className="admin-btn--danger-icon" title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <SectionPreview section={section} />
            </div>

            <AddButton onClick={() => setAddAtIndex(index + 1)} />
          </React.Fragment>
        ))}

        {sections.length === 0 && (
          <div className="admin-empty" style={{ padding: '40px 20px' }}>
            No content for <strong>{lang.toUpperCase()}</strong> yet. Click + to add sections.
          </div>
        )}
      </div>

      {editingSection && (
        <SectionEditor
          section={{ ...editingSection, page_slug: slug }}
          onClose={() => { setEditingSection(null); loadPage(); }}
          onSaved={() => { setEditingSection(null); loadPage(); }}
        />
      )}

      {addAtIndex !== null && (
        <AddSectionModal
          pageId={page.id}
          language={lang}
          order={addAtIndex < sections.length ? sections[addAtIndex]?.order - 1 : (sections[sections.length - 1]?.order || 0) + 1}
          onClose={() => setAddAtIndex(null)}
          onSaved={handleSectionSaved}
        />
      )}
    </div>
  );
};

const AddButton = ({ onClick, label }) => (
  <div className="admin-add-row">
    <button className="admin-add-btn" onClick={onClick} title={label || 'Add section'}>
      <FiPlus />
    </button>
  </div>
);

export default AdminPageEditor;
