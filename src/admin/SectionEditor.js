import React, { useState, useCallback, useRef } from 'react';
import {
  FiX, FiPlus, FiSave, FiChevronDown, FiChevronUp, FiImage,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
} from 'react-icons/fi';
import { adminApi } from '../api';
import CardEditor from './CardEditor';

const FONT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet MS' },
  { value: "'Segoe UI', sans-serif", label: 'Segoe UI' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: "'Roboto', sans-serif", label: 'Roboto' },
  { value: "'Open Sans', sans-serif", label: 'Open Sans' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
];

const ALIGN_OPTIONS = [
  { value: 'left', icon: FiAlignLeft, label: 'Left' },
  { value: 'center', icon: FiAlignCenter, label: 'Center' },
  { value: 'right', icon: FiAlignRight, label: 'Right' },
  { value: 'justify', icon: FiAlignJustify, label: 'Justify' },
];

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi-Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];

const CARDS_ALIGN_OPTIONS = [
  { value: 'left', icon: FiAlignLeft, label: 'Left' },
  { value: 'center', icon: FiAlignCenter, label: 'Center' },
  { value: 'right', icon: FiAlignRight, label: 'Right' },
  { value: 'stretch', icon: FiAlignJustify, label: 'Full width' },
];

const SectionEditor = ({ section, onClose, onSaved }) => {
  const [title, setTitle] = useState(section.title || '');
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [items, setItems] = useState(section.items || []);
  const [saving, setSaving] = useState(false);
  const [settingsState, setSettingsState] = useState({ ...(section.settings || {}) });
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(section.background_image_url || null);
  const bgFileRef = useRef();

  const sType = section.section_type;
  const isTextBlock = sType === 'text_block';
  const hasCards = !isTextBlock;

  const reloadItems = useCallback(() => {
    adminApi.getSections({ page: section.page }).then(({ data }) => {
      const list = data.results || data;
      const sec = list.find((s) => s.id === section.id);
      if (sec) setItems(sec.items || []);
    }).catch(() => {});
  }, [section.id, section.page]);

  const handleSaveSection = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('subtitle', subtitle);
      fd.append('settings', JSON.stringify(settingsState));
      fd.append('page', section.page);
      fd.append('section_type', section.section_type);
      fd.append('order', section.order);
      if (bgImageFile) fd.append('background_image', bgImageFile);
      await adminApi.updateSection(section.id, fd);
      onSaved();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    await adminApi.deleteItem(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleItemUpdated = useCallback(() => {
    reloadItems();
  }, [reloadItems]);

  const handleAddItem = async () => {
    try {
      const fd = new FormData();
      fd.append('section', section.id);
      fd.append('title', '');
      fd.append('description', '');
      fd.append('order', items.length);
      fd.append('extra_data', JSON.stringify({}));
      const { data } = await adminApi.createItem(fd);
      setItems((prev) => [...prev, data]);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  const hasTextSettings = ['about_teaser', 'about_hero_text', 'about_tech'].includes(sType);

  const updateSetting = (key, value) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  };

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImageFile(file);
      setBgImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveBgImage = () => {
    setBgImageFile(null);
    setBgImagePreview(null);
  };

  const textPreviewStyle = isTextBlock ? {
    fontSize: `${settingsState.font_size || 16}px`,
    fontWeight: settingsState.font_weight || '400',
    fontFamily: settingsState.font_family || 'inherit',
    color: settingsState.text_color || '#374151',
    textAlign: settingsState.text_align || 'left',
    lineHeight: 1.7,
  } : {};

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>{isTextBlock ? 'Edit Text Block' : 'Edit Section'}</h2>
          <button className="admin-modal__close" onClick={onClose}><FiX /></button>
        </div>

        <div className="admin-modal__body">

          {/* ── Text Block Mode ── */}
          {isTextBlock && (
            <>
              {/* Text styling toolbar */}
              <div className="ve-text-toolbar">
                <div className="ve-text-toolbar__row">
                  <select
                    className="ve-text-toolbar__select"
                    value={settingsState.font_family || ''}
                    onChange={(e) => updateSetting('font_family', e.target.value)}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    className="ve-text-toolbar__select ve-text-toolbar__select--sm"
                    value={settingsState.font_weight || '400'}
                    onChange={(e) => updateSetting('font_weight', e.target.value)}
                  >
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>

                  <div className="ve-text-toolbar__size">
                    <input
                      type="number"
                      className="ve-text-toolbar__num"
                      min="10"
                      max="72"
                      value={settingsState.font_size || 16}
                      onChange={(e) => updateSetting('font_size', Number(e.target.value))}
                    />
                    <span className="ve-text-toolbar__unit">px</span>
                  </div>

                  <div className="ve-text-toolbar__color">
                    <input
                      type="color"
                      value={settingsState.text_color || '#374151'}
                      onChange={(e) => updateSetting('text_color', e.target.value)}
                    />
                  </div>
                </div>

                <div className="ve-text-toolbar__row">
                  <div className="ve-text-toolbar__align">
                    {ALIGN_OPTIONS.map((a) => (
                      <button
                        key={a.value}
                        className={`ve-text-toolbar__align-btn ${(settingsState.text_align || 'left') === a.value ? 've-text-toolbar__align-btn--active' : ''}`}
                        onClick={() => updateSetting('text_align', a.value)}
                        title={a.label}
                      >
                        <a.icon />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live-preview text area */}
              <div className="ve-text-preview" style={{ backgroundColor: settingsState.bg_color || undefined }}>
                <textarea
                  className="ve-text-preview__input"
                  style={textPreviewStyle}
                  value={settingsState.body || ''}
                  onChange={(e) => updateSetting('body', e.target.value)}
                  placeholder="Enter your text here..."
                  rows={8}
                />
              </div>
            </>
          )}

          {/* ── Normal section mode (title + subtitle + cards) ── */}
          {!isTextBlock && (
            <>
              <div className="ve-section-field">
                <label className="ve-label">Section Title</label>
                <input
                  className="ve-input ve-input--lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter section title..."
                  style={settingsState.title_color ? { color: settingsState.title_color } : undefined}
                />
              </div>

              {(subtitle || sType === 'services' || sType === 'team') && (
                <div className="ve-section-field">
                  <label className="ve-label">Subtitle</label>
                  <textarea
                    className="ve-textarea"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Enter subtitle..."
                    rows={2}
                  />
                </div>
              )}

              {hasTextSettings && settingsState.bold_text !== undefined && (
                <div className="ve-section-field">
                  <label className="ve-label">Main Text</label>
                  <textarea
                    className="ve-textarea"
                    value={settingsState.bold_text || ''}
                    onChange={(e) => updateSetting('bold_text', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
              {hasTextSettings && settingsState.lead !== undefined && (
                <div className="ve-section-field">
                  <label className="ve-label">Description</label>
                  <textarea
                    className="ve-textarea"
                    value={settingsState.lead || ''}
                    onChange={(e) => updateSetting('lead', e.target.value)}
                    rows={4}
                  />
                </div>
              )}
              {hasTextSettings && settingsState.body !== undefined && (
                <div className="ve-section-field">
                  <label className="ve-label">Body Text</label>
                  <textarea
                    className="ve-textarea"
                    value={settingsState.body || ''}
                    onChange={(e) => updateSetting('body', e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </>
          )}

          {/* ── Style Settings Panel (all types) ── */}
          <div className="ve-style-panel">
            <button
              className="ve-style-panel__toggle"
              onClick={() => setShowStylePanel(!showStylePanel)}
            >
              {showStylePanel ? <FiChevronUp /> : <FiChevronDown />}
              <span>Style Settings</span>
            </button>

            {showStylePanel && (
              <div className="ve-style-panel__body">
                <div className="ve-style-row">
                  {!isTextBlock && (
                    <div className="ve-style-field">
                      <label className="ve-label">Title Color</label>
                      <div className="ve-color-input">
                        <input
                          type="color"
                          value={settingsState.title_color || '#111827'}
                          onChange={(e) => updateSetting('title_color', e.target.value)}
                        />
                        <input
                          type="text"
                          className="ve-input-sm"
                          value={settingsState.title_color || ''}
                          onChange={(e) => updateSetting('title_color', e.target.value)}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  )}

                  <div className="ve-style-field">
                    <label className="ve-label">Background Color</label>
                    <div className="ve-color-input">
                      <input
                        type="color"
                        value={settingsState.bg_color || '#ffffff'}
                        onChange={(e) => updateSetting('bg_color', e.target.value)}
                      />
                      <input
                        type="text"
                        className="ve-input-sm"
                        value={settingsState.bg_color || ''}
                        onChange={(e) => updateSetting('bg_color', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="ve-style-field">
                    <label className="ve-label">Bottom Margin (px)</label>
                    <div className="ve-range-input">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settingsState.margin_bottom ?? 0}
                        onChange={(e) => updateSetting('margin_bottom', Number(e.target.value))}
                      />
                      <span className="ve-range-value">{settingsState.margin_bottom ?? 0}px</span>
                    </div>
                  </div>
                </div>

                {/* Cards alignment (only for sections with cards) */}
                {hasCards && (
                  <div className="ve-style-field">
                    <label className="ve-label">Cards Alignment</label>
                    <div className="ve-text-toolbar__align">
                      {CARDS_ALIGN_OPTIONS.map((a) => (
                        <button
                          key={a.value}
                          className={`ve-text-toolbar__align-btn ${(settingsState.cards_align || 'stretch') === a.value ? 've-text-toolbar__align-btn--active' : ''}`}
                          onClick={() => updateSetting('cards_align', a.value)}
                          title={a.label}
                        >
                          <a.icon />
                          <span className="ve-text-toolbar__align-label">{a.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ve-style-field">
                  <label className="ve-label">Background Image</label>
                  <div className="ve-bg-image-area">
                    {bgImagePreview ? (
                      <div className="ve-bg-image-preview">
                        <img src={bgImagePreview} alt="" />
                        <div className="ve-bg-image-actions">
                          <button className="admin-btn admin-btn--sm" onClick={() => bgFileRef.current?.click()}>
                            Change
                          </button>
                          <button className="admin-btn admin-btn--sm" onClick={handleRemoveBgImage} style={{ color: '#dc2626' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="ve-bg-image-upload" onClick={() => bgFileRef.current?.click()}>
                        <FiImage />
                        <span>Add background image</span>
                      </button>
                    )}
                    <input ref={bgFileRef} type="file" accept="image/*" onChange={handleBgImageChange} hidden />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Cards grid (only for non-text sections) ── */}
          {hasCards && (
            <div className="ve-cards-section">
              <div className="ve-cards-header">
                <span className="ve-cards-count">{items.length} item(s)</span>
              </div>

              <div
                className={`ve-cards-grid ve-cards-grid--${sType}`}
                style={settingsState.bg_color ? { background: settingsState.bg_color, padding: 16, borderRadius: 12 } : undefined}
              >
                {items.map((item) => (
                  <CardEditor
                    key={item.id}
                    item={item}
                    sectionType={sType}
                    onDelete={() => handleDeleteItem(item.id)}
                    onUpdated={handleItemUpdated}
                  />
                ))}

                <button className="ve-add-card" onClick={handleAddItem}>
                  <FiPlus className="ve-add-card__icon" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal__footer">
          <button className="admin-btn" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSaveSection} disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
