import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  FiX, FiPlus, FiSave, FiChevronDown, FiChevronUp, FiImage, FiMove,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
} from 'react-icons/fi';
import { adminApi } from '../api';
import CardEditor from './CardEditor';
import useAdminT from './i18n';
import '../pages/DynamicPage.css';

const HTML_TAG_RE = /<\/?[a-zA-Z][\s\S]*?>/;

const FONT_OPTIONS_BASE = [
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

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

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
  const t = useAdminT();

  const FONT_OPTIONS = useMemo(() => [
    { value: '', label: t.common.default },
    ...FONT_OPTIONS_BASE,
  ], [t.common.default]);

  const ALIGN_OPTIONS = useMemo(() => [
    { value: 'left', icon: FiAlignLeft, label: t.section.alignLeft },
    { value: 'center', icon: FiAlignCenter, label: t.section.alignCenter },
    { value: 'right', icon: FiAlignRight, label: t.section.alignRight },
    { value: 'justify', icon: FiAlignJustify, label: t.section.alignJustify },
  ], [t.section.alignLeft, t.section.alignCenter, t.section.alignRight, t.section.alignJustify]);

  const WEIGHT_OPTIONS = useMemo(() => [
    { value: '300', label: t.section.weightLight },
    { value: '400', label: t.section.weightNormal },
    { value: '500', label: t.section.weightMedium },
    { value: '600', label: t.section.weightSemiBold },
    { value: '700', label: t.section.weightBold },
    { value: '800', label: t.section.weightExtraBold },
  ], [t.section.weightLight, t.section.weightNormal, t.section.weightMedium, t.section.weightSemiBold, t.section.weightBold, t.section.weightExtraBold]);

  const CARDS_ALIGN_OPTIONS = useMemo(() => [
    { value: 'left', icon: FiAlignLeft, label: t.section.alignLeft },
    { value: 'center', icon: FiAlignCenter, label: t.section.alignCenter },
    { value: 'right', icon: FiAlignRight, label: t.section.alignRight },
    { value: 'stretch', icon: FiAlignJustify, label: t.section.alignFullWidth },
  ], [t.section.alignLeft, t.section.alignCenter, t.section.alignRight, t.section.alignFullWidth]);

  const sType = section.section_type;
  const isTextBlock = sType === 'text_block';
  const isHero = sType === 'hero';
  const isVideo = sType === 'video_block';
  const hasCards = !isTextBlock && !isVideo;

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
      alert(t.common.error + ': ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm(t.section.deleteItemConfirm)) return;
    await adminApi.deleteItem(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleItemUpdated = useCallback(() => {
    reloadItems();
  }, [reloadItems]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items],
  );

  const [teamDragId, setTeamDragId] = useState(null);

  const handleTeamDragStart = useCallback((e, itemId) => {
    setTeamDragId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(itemId));
  }, []);

  const handleTeamDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleTeamDrop = useCallback(async (e, targetId) => {
    e.preventDefault();
    const sourceId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    setTeamDragId(null);
    if (!sourceId || sourceId === targetId) return;

    const orderIds = sortedItems.map((i) => i.id);
    const fromIdx = orderIds.indexOf(sourceId);
    const toIdx = orderIds.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const next = [...orderIds];
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, sourceId);

    try {
      await Promise.all(
        next.map((itemId, index) => {
          const fd = new FormData();
          fd.append('order', String(index));
          fd.append('section', String(section.id));
          return adminApi.updateItem(itemId, fd);
        }),
      );
      reloadItems();
    } catch (err) {
      alert(t.section.reorderFail + (err.response?.data?.detail || err.message));
    }
  }, [sortedItems, section.id, reloadItems, t.section.reorderFail]);

  const handleTeamDragEnd = useCallback(() => {
    setTeamDragId(null);
  }, []);

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
      alert(t.common.error + ': ' + (err.response?.data?.detail || err.message));
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

  const textPreviewStyle = (isTextBlock || isHero) ? {
    fontSize: `${settingsState.font_size || (isHero ? 44 : 16)}px`,
    fontWeight: settingsState.font_weight || (isHero ? '800' : '400'),
    fontFamily: settingsState.font_family || 'inherit',
    color: settingsState.text_color || (isHero ? '#ffffff' : '#374151'),
    textAlign: settingsState.text_align || 'left',
    lineHeight: isHero ? 1.3 : 1.7,
  } : {};

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>{isTextBlock ? t.section.editTextBlock : isVideo ? t.section.editVideoBlock : t.section.editSection}</h2>
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

              {/* Format toggle */}
              <div className="ve-text-format">
                <div className="ve-text-format__toggle" role="tablist" aria-label={t.section.textFormatPlain}>
                  <button
                    type="button"
                    className={`ve-text-format__tab ${(settingsState.body_format || 'plain') !== 'html' ? 've-text-format__tab--active' : ''}`}
                    onClick={() => updateSetting('body_format', 'plain')}
                  >
                    {t.section.textFormatPlain}
                  </button>
                  <button
                    type="button"
                    className={`ve-text-format__tab ${settingsState.body_format === 'html' ? 've-text-format__tab--active' : ''}`}
                    onClick={() => updateSetting('body_format', 'html')}
                  >
                    {t.section.textFormatHtml}
                  </button>
                </div>
                {settingsState.body_format === 'html' && (
                  <div className="ve-text-format__hint">
                    {t.section.htmlHint}
                  </div>
                )}
              </div>

              {/* Quick insert toolbar for HTML mode */}
              {settingsState.body_format === 'html' && (
                <div className="ve-text-insert">
                  {[
                    { label: t.section.snippetH2, snippet: '<h2>Heading</h2>\n' },
                    { label: t.section.snippetH3, snippet: '<h3>Subheading</h3>\n' },
                    { label: t.section.snippetParagraph, snippet: '<p>Your paragraph text…</p>\n' },
                    { label: t.section.snippetBullet, snippet: '<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>\n' },
                    { label: t.section.snippetCheck, snippet: '<ul class="dp-checklist">\n  <li>First point</li>\n  <li>Second point</li>\n</ul>\n' },
                    { label: t.section.snippetQuote, snippet: '<blockquote>Quoted text…</blockquote>\n' },
                    { label: t.section.snippetBold, snippet: '<strong>bold text</strong>' },
                    { label: t.section.snippetItalic, snippet: '<em>italic text</em>' },
                    { label: t.section.snippetLink, snippet: '<a href="https://">link text</a>' },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      className="ve-text-insert__btn"
                      onClick={() => updateSetting('body', `${settingsState.body || ''}${settingsState.body ? '\n' : ''}${btn.snippet}`)}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Split editor + live preview */}
              <div className={`ve-text-editor ${settingsState.body_format === 'html' ? 've-text-editor--split' : ''}`}>
                <div className="ve-text-preview" style={{ backgroundColor: settingsState.bg_color || undefined }}>
                  <textarea
                    className="ve-text-preview__input"
                    style={textPreviewStyle}
                    value={settingsState.body || ''}
                    onChange={(e) => updateSetting('body', e.target.value)}
                    placeholder={settingsState.body_format === 'html'
                      ? t.section.htmlPlaceholder
                      : t.section.plainPlaceholder}
                    rows={10}
                  />
                </div>

                {settingsState.body_format === 'html' && (
                  <div className="ve-text-livepreview" style={{ backgroundColor: settingsState.bg_color || undefined }}>
                    <div className="ve-text-livepreview__label">{t.section.livePreviewLabel}</div>
                    {(settingsState.body || '').trim() ? (
                      <div
                        className="dp-text-block__body dp-text-block__body--html"
                        style={textPreviewStyle}
                        dangerouslySetInnerHTML={{ __html: settingsState.body }}
                      />
                    ) : (
                      <div className="ve-text-livepreview__empty">{t.section.livePreviewEmpty}</div>
                    )}
                  </div>
                )}
              </div>

              {settingsState.body_format !== 'html' && HTML_TAG_RE.test(settingsState.body || '') && (
                <div className="ve-text-format__warning">
                  {t.section.htmlWarning}
                </div>
              )}
            </>
          )}

          {/* ── Video Block Mode ── */}
          {isVideo && (
            <>
              <div className="ve-section-field">
                <label className="ve-label">{t.section.sectionTitleOptional}</label>
                <input
                  className="ve-input ve-input--lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.section.sectionTitleVideoPlaceholder}
                />
              </div>

              <div className="ve-section-field">
                <label className="ve-label">{t.section.youtubeLink}</label>
                <input
                  className="ve-input"
                  value={settingsState.video_url || ''}
                  onChange={(e) => updateSetting('video_url', e.target.value)}
                  placeholder={t.section.youtubeLinkPlaceholder}
                />
              </div>

              {settingsState.video_url && extractYouTubeId(settingsState.video_url) && (
                <div className="ve-video-preview">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(settingsState.video_url)}`}
                    title="Video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="ve-video-preview__iframe"
                  />
                </div>
              )}

              {settingsState.video_url && !extractYouTubeId(settingsState.video_url) && (
                <p style={{ color: '#dc2626', fontSize: 13 }}>
                  {t.section.youtubeParseError}
                </p>
              )}
            </>
          )}

          {/* ── Hero Banner Mode ── */}
          {isHero && (
            <>
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
                    value={settingsState.font_weight || '800'}
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
                      min="16"
                      max="120"
                      value={settingsState.font_size || 44}
                      onChange={(e) => updateSetting('font_size', Number(e.target.value))}
                    />
                    <span className="ve-text-toolbar__unit">px</span>
                  </div>

                  <div className="ve-text-toolbar__color">
                    <input
                      type="color"
                      value={settingsState.text_color || '#ffffff'}
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

                  <div className="ve-color-input" style={{ marginLeft: 'auto' }}>
                    <label className="ve-label--sm" style={{ marginRight: 6 }}>BG</label>
                    <input
                      type="color"
                      value={settingsState.bg_color || '#5B2D8E'}
                      onChange={(e) => updateSetting('bg_color', e.target.value)}
                    />
                    <input
                      type="text"
                      className="ve-input-sm"
                      style={{ width: 80 }}
                      value={settingsState.bg_color || ''}
                      onChange={(e) => updateSetting('bg_color', e.target.value)}
                      placeholder="#5B2D8E"
                    />
                  </div>
                </div>
              </div>

              <div
                className="ve-hero-preview"
                style={{
                  backgroundColor: settingsState.bg_color || '#5B2D8E',
                  backgroundImage: bgImagePreview ? `url(${bgImagePreview})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <textarea
                  className="ve-hero-preview__input"
                  style={textPreviewStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.section.heroTitlePlaceholder}
                  rows={3}
                />
                <input
                  className="ve-hero-preview__subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={t.section.heroSubtitlePlaceholder}
                />
              </div>
            </>
          )}

          {/* ── Normal section mode (title + subtitle + cards) ── */}
          {!isTextBlock && !isHero && (
            <>
              <div className="ve-section-field">
                <label className="ve-label">{t.section.sectionTitle}</label>
                <input
                  className="ve-input ve-input--lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.section.sectionTitlePlaceholder}
                  style={settingsState.title_color ? { color: settingsState.title_color } : undefined}
                />
              </div>

              {(subtitle || sType === 'services' || sType === 'team') && (
                <div className="ve-section-field">
                  <label className="ve-label">{t.section.subtitle}</label>
                  <textarea
                    className="ve-textarea"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={t.section.subtitlePlaceholder}
                    rows={2}
                  />
                </div>
              )}

              {hasTextSettings && settingsState.bold_text !== undefined && (
                <div className="ve-section-field">
                  <label className="ve-label">{t.section.mainText}</label>
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
                  <label className="ve-label">{t.section.description}</label>
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
                  <label className="ve-label">{t.section.bodyText}</label>
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
              <span>{t.section.styleSettings}</span>
            </button>

            {showStylePanel && (
              <div className="ve-style-panel__body">
                <div className="ve-style-row">
                  {!isTextBlock && (
                    <div className="ve-style-field">
                      <label className="ve-label">{t.section.titleColor}</label>
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
                    <label className="ve-label">{t.section.bgColor}</label>
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
                    <label className="ve-label">{t.section.bottomMargin}</label>
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

                {/* Carousel-specific settings */}
                {sType === 'card_carousel' && (
                  <div className="ve-style-field">
                    <label className="ve-label">{t.section.carouselSettings}</label>
                    <div className="ve-carousel-settings">
                      <div className="ve-carousel-settings__row">
                        <label className="ve-checkbox-label">
                          <input
                            type="checkbox"
                            checked={settingsState.autoplay !== false}
                            onChange={(e) => updateSetting('autoplay', e.target.checked)}
                          />
                          <span>{t.section.autoplay}</span>
                        </label>
                        {settingsState.autoplay !== false && (
                          <div className="ve-carousel-settings__speed">
                            <label className="ve-label--sm">{t.section.delayMs}</label>
                            <input
                              type="number"
                              className="ve-input-sm"
                              min="1000"
                              max="15000"
                              step="500"
                              value={settingsState.autoplay_delay || 4000}
                              onChange={(e) => updateSetting('autoplay_delay', Number(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                      <div className="ve-carousel-settings__row">
                        <label className="ve-checkbox-label">
                          <input
                            type="checkbox"
                            checked={settingsState.loop !== false}
                            onChange={(e) => updateSetting('loop', e.target.checked)}
                          />
                          <span>{t.section.loopInfinite}</span>
                        </label>
                      </div>
                      <div className="ve-carousel-settings__row">
                        <label className="ve-label--sm">{t.section.slidesPerView}</label>
                        <select
                          className="ve-select"
                          value={settingsState.slides_per_view || 3}
                          onChange={(e) => updateSetting('slides_per_view', Number(e.target.value))}
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cards alignment (only for sections with cards) */}
                {hasCards && (
                  <div className="ve-style-field">
                    <label className="ve-label">{t.section.cardsAlignment}</label>
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
                  <label className="ve-label">{t.section.bgImage}</label>
                  <div className="ve-bg-image-area">
                    {bgImagePreview ? (
                      <div className="ve-bg-image-preview">
                        <img src={bgImagePreview} alt="" />
                        <div className="ve-bg-image-actions">
                          <button className="admin-btn admin-btn--sm" onClick={() => bgFileRef.current?.click()}>
                            {t.common.change}
                          </button>
                          <button className="admin-btn admin-btn--sm" onClick={handleRemoveBgImage} style={{ color: '#dc2626' }}>
                            {t.common.remove}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="ve-bg-image-upload" onClick={() => bgFileRef.current?.click()}>
                        <FiImage />
                        <span>{t.section.addBgImage}</span>
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
                <span className="ve-cards-count">
                  {isHero ? t.section.photosCount(items.length) : t.section.itemsCount(items.length)}
                </span>
                {sType === 'team' && items.length > 1 && (
                  <span className="ve-cards-reorder-hint">{t.section.teamReorderHint}</span>
                )}
              </div>

              <div
                className={`ve-cards-grid ve-cards-grid--${sType}`}
                style={settingsState.bg_color ? { background: settingsState.bg_color, padding: 16, borderRadius: 12 } : undefined}
              >
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    className={
                      `ve-card-drag-wrap${sType === 'team' ? ' ve-card-drag-wrap--team' : ''}${
                        teamDragId === item.id ? ' ve-card-drag-wrap--dragging' : ''
                      }`
                    }
                    onDragOver={sType === 'team' ? handleTeamDragOver : undefined}
                    onDrop={sType === 'team' ? (ev) => handleTeamDrop(ev, item.id) : undefined}
                    onDragEnd={sType === 'team' ? handleTeamDragEnd : undefined}
                  >
                    {sType === 'team' && (
                      <div
                        className="ve-card-drag-handle"
                        draggable
                        onDragStart={(ev) => handleTeamDragStart(ev, item.id)}
                        title={t.section.dragToReorder}
                        role="button"
                        tabIndex={0}
                        aria-grabbed={teamDragId === item.id}
                      >
                        <FiMove aria-hidden />
                        <span>{t.section.reorder}</span>
                      </div>
                    )}
                    <CardEditor
                      item={item}
                      sectionType={sType}
                      onDelete={() => handleDeleteItem(item.id)}
                      onUpdated={handleItemUpdated}
                    />
                  </div>
                ))}

                {!(isHero && items.length >= 1) && (
                  <button className="ve-add-card" onClick={handleAddItem}>
                    <FiPlus className="ve-add-card__icon" />
                    <span>{isHero ? t.section.addPhoto : t.section.addCard}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal__footer">
          <button className="admin-btn" onClick={onClose}>{t.common.cancel}</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSaveSection} disabled={saving}>
            <FiSave /> {saving ? t.common.saving : t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
