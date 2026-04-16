import React, { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiCamera, FiLink, FiX, FiMove } from 'react-icons/fi';
import { adminApi, publicApi } from '../api';
import getIcon from '../utils/iconMap';
import ImagePositioner from './ImagePositioner';

const CardEditor = ({ item, sectionType, onDelete, onUpdated }) => {
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');
  const [linkUrl, setLinkUrl] = useState(item.link_url || '');
  const [linkText, setLinkText] = useState(item.link_text || '');
  const [iconName, setIconName] = useState(item.icon_name || '');
  const [imagePreview, setImagePreview] = useState(item.image_url || null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showPositioner, setShowPositioner] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fileRef = useRef();
  const extraData = item.extra_data || {};

  const imgPos = extraData.img_pos || { x: 50, y: 50 };
  const [currentPos, setCurrentPos] = useState(imgPos);

  const markDirty = () => setDirty(true);

  const handleImageClick = () => {
    if (imagePreview) {
      setShowImageMenu(true);
    } else {
      fileRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowImageMenu(false);
      setCurrentPos({ x: 50, y: 50 });
      setTimeout(() => setShowPositioner(true), 100);
      markDirty();
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentPos({ x: 50, y: 50 });
    markDirty();
    setShowImageMenu(false);
  };

  const handleChangeImage = () => {
    setShowImageMenu(false);
    fileRef.current?.click();
  };

  const handlePositionConfirm = (pos) => {
    setCurrentPos(pos);
    extraData.img_pos = pos;
    setShowPositioner(false);
    markDirty();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const savedExtra = { ...extraData, img_pos: currentPos };
      const fd = new FormData();
      fd.append('section', item.section);
      fd.append('title', title);
      fd.append('description', description);
      fd.append('icon_name', iconName);
      fd.append('link_url', linkUrl);
      fd.append('link_text', linkText);
      fd.append('order', item.order);
      fd.append('extra_data', JSON.stringify(savedExtra));
      if (imageFile) fd.append('image', imageFile);
      await adminApi.updateItem(item.id, fd);
      setDirty(false);
      onUpdated();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const isHeroPhoto = sectionType === 'hero';
  const hasImage = ['hero', 'team', 'steps', 'services', 'blog', 'about_teaser', 'about_tech', 'card_grid', 'card_carousel'].includes(sectionType);
  const hasLink = ['blog', 'services', 'card_grid', 'card_carousel'].includes(sectionType);
  const hasIcon = ['features_carousel', 'why_choose_us'].includes(sectionType);
  const hasNumber = sectionType === 'steps';
  const isTestimonial = sectionType === 'testimonials';
  const hasTitle = !isTestimonial && !isHeroPhoto;
  const hasDescription = !isHeroPhoto;

  const IconComp = getIcon(iconName);

  return (
    <div className={`ve-card ${dirty ? 've-card--dirty' : ''}`}>
      <button className="ve-card__delete" onClick={onDelete} title="Delete">
        <FiTrash2 />
      </button>

      {hasImage && (
        <div className="ve-card__image-area" onClick={handleImageClick}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt=""
              className="ve-card__image"
              style={{ objectPosition: `${currentPos.x}% ${currentPos.y}%` }}
            />
          ) : (
            <div className="ve-card__image-placeholder">
              <FiCamera />
              <span>Click to add photo</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} hidden />

          {imagePreview && (
            <button
              className="ve-card__reposition-btn"
              title="Reposition image"
              onClick={(e) => { e.stopPropagation(); setShowPositioner(true); }}
            >
              <FiMove />
            </button>
          )}

          {showImageMenu && (
            <div className="ve-card__image-menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleChangeImage}><FiCamera /> Change photo</button>
              <button onClick={() => { setShowImageMenu(false); setShowPositioner(true); }}><FiMove /> Reposition</button>
              <button onClick={handleRemoveImage} className="ve-danger"><FiTrash2 /> Remove photo</button>
              <button onClick={() => setShowImageMenu(false)}><FiX /> Cancel</button>
            </div>
          )}
        </div>
      )}

      {hasIcon && (
        <div className="ve-card__icon-row">
          <div className="ve-card__icon-preview">
            {IconComp ? <IconComp /> : <span>?</span>}
          </div>
          <select
            className="ve-select"
            value={iconName}
            onChange={(e) => { setIconName(e.target.value); markDirty(); }}
          >
            <option value="">Select icon...</option>
            <option value="FaUserMd">Doctor</option>
            <option value="FaHospital">Hospital</option>
            <option value="FaHandHoldingHeart">Caring Heart</option>
            <option value="FaGlobe">Globe</option>
            <option value="FaAward">Award</option>
            <option value="FaMicroscope">Microscope</option>
            <option value="FaGlobeAmericas">World</option>
            <option value="FaHeart">Heart</option>
            <option value="FaUsers">Users</option>
            <option value="FaPray">Prayer</option>
          </select>
        </div>
      )}

      {hasNumber && (
        <div className="ve-card__number">
          {extraData.number || '01'}
        </div>
      )}

      {hasTitle && (
        <input
          className="ve-card__title-input"
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          placeholder="Title..."
        />
      )}

      {hasDescription && (
        <textarea
          className="ve-card__desc-input"
          value={description}
          onChange={(e) => { setDescription(e.target.value); markDirty(); }}
          placeholder={isTestimonial ? 'Quote text...' : 'Description...'}
          rows={isTestimonial ? 4 : 2}
        />
      )}

      {isTestimonial && (
        <input
          className="ve-card__author-input"
          value={extraData.author || ''}
          onChange={(e) => { extraData.author = e.target.value; setDescription(description); markDirty(); }}
          placeholder="Author name..."
        />
      )}

      {hasLink && (
        <div className="ve-card__link-section">
          {showLinkEditor ? (
            <LinkEditor
              linkText={linkText}
              linkUrl={linkUrl}
              onLinkTextChange={(v) => { setLinkText(v); markDirty(); }}
              onLinkUrlChange={(v) => { setLinkUrl(v); markDirty(); }}
              onDone={() => setShowLinkEditor(false)}
              hideLinkText={sectionType === 'services'}
              listAllPages={sectionType === 'services'}
            />
          ) : (
            <button type="button" className="ve-card__link-btn" onClick={() => setShowLinkEditor(true)}>
              <FiLink />
              {sectionType === 'services'
                ? (linkUrl ? 'Edit link / detach' : 'Attach link (page or URL)')
                : (linkText || 'Add link')}
            </button>
          )}
        </div>
      )}

      {sectionType === 'services' && !showLinkEditor && (
        <p className="ve-services-link-hint">
          {linkUrl
            ? <>On the site the whole card is clickable and opens: <strong>{linkUrl}</strong></>
            : <>No link — the card is not clickable. Use &quot;Attach link&quot; to bind a page or URL.</>}
        </p>
      )}

      {dirty && (
        <button className="ve-card__save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      )}

      {showPositioner && imagePreview && (
        <ImagePositioner
          src={imagePreview}
          initialPosition={currentPos}
          onConfirm={handlePositionConfirm}
          onCancel={() => setShowPositioner(false)}
          sectionType={sectionType}
        />
      )}
    </div>
  );
};

function internalPathForPage(p) {
  if (!p) return '';
  if (p.slug === 'home') return '/';
  if (p.show_in_nav) return `/${p.slug}`;
  return `/page/${p.slug}`;
}

function slugFromInternalPath(url) {
  if (!url || !String(url).trim()) return '';
  let u = String(url).trim().split('?')[0];
  if (u.length > 1 && u.endsWith('/')) u = u.slice(0, -1);
  if (u === '/' || u === '') return 'home';
  const pageMatch = u.match(/^\/page\/([^/]+)$/);
  if (pageMatch) return pageMatch[1];
  const pathMatch = u.match(/^\/([^/]+)$/);
  if (pathMatch) return pathMatch[1];
  return '';
}

const LinkEditor = ({
  linkText,
  linkUrl,
  onLinkTextChange,
  onLinkUrlChange,
  onDone,
  hideLinkText = false,
  listAllPages = false,
}) => {
  const [mode, setMode] = useState(() => {
    if (!linkUrl) return 'page';
    if (/^https?:\/\//i.test(linkUrl)) return 'external';
    return 'page';
  });
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!linkUrl) setMode('page');
    else if (/^https?:\/\//i.test(linkUrl)) setMode('external');
    else setMode('page');
  }, [linkUrl]);

  useEffect(() => {
    publicApi.getPages().then(({ data }) => {
      const list = listAllPages
        ? [...data].sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }))
        : data.filter((p) => !p.show_in_nav);
      setPages(list);
    }).catch(() => {});
  }, [listAllPages]);

  const handlePageSelect = (slug) => {
    if (!slug) {
      onLinkUrlChange('');
      return;
    }
    if (listAllPages) {
      const p = pages.find((x) => x.slug === slug);
      onLinkUrlChange(p ? internalPathForPage(p) : `/page/${slug}`);
    } else {
      onLinkUrlChange(`/page/${slug}`);
    }
  };

  const selectedSlug = mode === 'page' ? slugFromInternalPath(linkUrl) : '';
  const pageTabLabel = listAllPages ? 'Site page' : 'Your Page';

  return (
    <div className="ve-card__link-editor">
      {!hideLinkText && (
        <input
          className="ve-input-sm"
          value={linkText}
          onChange={(e) => onLinkTextChange(e.target.value)}
          placeholder="Link text (e.g. READ MORE)"
        />
      )}
      <div className="ve-link-mode-tabs">
        <button
          type="button"
          className={`ve-link-mode-tab ${mode === 'external' ? 've-link-mode-tab--active' : ''}`}
          onClick={() => setMode('external')}
        >
          External URL
        </button>
        <button
          type="button"
          className={`ve-link-mode-tab ${mode === 'page' ? 've-link-mode-tab--active' : ''}`}
          onClick={() => setMode('page')}
        >
          {pageTabLabel}
        </button>
      </div>
      {mode === 'external' ? (
        <input
          className="ve-input-sm"
          value={linkUrl}
          onChange={(e) => onLinkUrlChange(e.target.value)}
          placeholder="URL (e.g. https://... or /services)"
        />
      ) : (
        <select
          className="ve-select"
          value={selectedSlug}
          onChange={(e) => handlePageSelect(e.target.value)}
        >
          <option value="">{listAllPages ? 'Choose a page…' : 'Select a page...'}</option>
          {pages.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.title}{listAllPages && p.show_in_nav ? ' (menu)' : ''}
            </option>
          ))}
        </select>
      )}
      <div className="ve-link-editor__actions">
        <button
          type="button"
          className="ve-link-remove"
          onClick={() => {
            onLinkUrlChange('');
            onLinkTextChange('');
            setMode('page');
          }}
        >
          Remove link
        </button>
        <button type="button" className="ve-link-done" onClick={onDone}>Done</button>
      </div>
    </div>
  );
};

export default CardEditor;
