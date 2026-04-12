import React, { useState } from 'react';
import {
  FiX, FiType, FiGrid, FiImage, FiSliders,
  FiStar, FiUsers, FiMessageSquare, FiBookOpen, FiLayout,
} from 'react-icons/fi';
import { adminApi } from '../api';

const SECTION_TYPES = [
  {
    value: 'text_block',
    label: 'Text Block',
    desc: 'A block with title and text. You can customize font, size, color and alignment.',
    icon: FiType,
    preview: 'text',
  },
  {
    value: 'card_grid',
    label: 'Cards with Images',
    desc: 'A grid of cards, each with an image, title, text and optional link.',
    icon: FiGrid,
    preview: 'cards',
  },
  {
    value: 'card_carousel',
    label: 'Card Carousel',
    desc: 'A scrollable carousel of cards with images and text.',
    icon: FiSliders,
    preview: 'carousel',
  },
  {
    value: 'hero',
    label: 'Hero Banner',
    desc: 'A big banner with title and background image at the top of the page.',
    icon: FiLayout,
    preview: 'hero',
  },
  {
    value: 'services',
    label: 'Services',
    desc: 'Service cards with image, title and link.',
    icon: FiImage,
    preview: 'cards',
  },
  {
    value: 'team',
    label: 'Team Members',
    desc: 'Team cards with photo, name and role.',
    icon: FiUsers,
    preview: 'team',
  },
  {
    value: 'testimonials',
    label: 'Testimonials',
    desc: 'Patient reviews with quotes and author names.',
    icon: FiMessageSquare,
    preview: 'quotes',
  },
  {
    value: 'blog',
    label: 'Blog Posts',
    desc: 'Blog cards with image, title and "Read More" link.',
    icon: FiBookOpen,
    preview: 'cards',
  },
  {
    value: 'why_choose_us',
    label: 'Features with Icons',
    desc: 'Cards with icons, titles and short descriptions.',
    icon: FiStar,
    preview: 'icons',
  },
];

const AddSectionModal = ({ pageId, order, language = 'en', onClose, onSaved }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState('');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!selectedType) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('page', pageId);
      fd.append('section_type', selectedType);
      fd.append('language', language);
      fd.append('order', order);
      fd.append('title', title);
      fd.append('subtitle', '');
      fd.append('settings', JSON.stringify({}));
      await adminApi.createSection(fd);
      onSaved();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>{step === 1 ? 'Choose Section Type' : 'Set Title'}</h2>
          <button className="admin-modal__close" onClick={onClose}><FiX /></button>
        </div>

        <div className="admin-modal__body">
          {step === 1 && (
            <div className="ve-type-grid">
              {SECTION_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    className={`ve-type-card ${selectedType === type.value ? 've-type-card--selected' : ''}`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <div className="ve-type-card__preview">
                      <PreviewMini type={type.preview} />
                    </div>
                    <div className="ve-type-card__info">
                      <div className="ve-type-card__name">
                        <Icon /> {type.label}
                      </div>
                      <p className="ve-type-card__desc">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="ve-section-field">
              <label className="ve-label">Section Title</label>
              <input
                className="ve-input ve-input--lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. OUR SERVICES"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="admin-modal__footer">
          {step === 2 && (
            <button className="admin-btn" onClick={() => setStep(1)}>Back</button>
          )}
          <button className="admin-btn" onClick={onClose}>Cancel</button>
          {step === 1 && (
            <button
              className="admin-btn admin-btn--primary"
              disabled={!selectedType}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button
              className="admin-btn admin-btn--primary"
              disabled={saving}
              onClick={handleCreate}
            >
              {saving ? 'Creating...' : 'Create Section'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PreviewMini = ({ type }) => {
  if (type === 'text') {
    return (
      <div className="ve-mini ve-mini--text">
        <div className="ve-mini__line ve-mini__line--title" />
        <div className="ve-mini__line" />
        <div className="ve-mini__line ve-mini__line--short" />
      </div>
    );
  }
  if (type === 'cards' || type === 'carousel') {
    return (
      <div className="ve-mini ve-mini--cards">
        {[1, 2, 3].map((i) => (
          <div key={i} className="ve-mini__card">
            <div className="ve-mini__card-img" />
            <div className="ve-mini__line ve-mini__line--sm" />
          </div>
        ))}
      </div>
    );
  }
  if (type === 'hero') {
    return (
      <div className="ve-mini ve-mini--hero">
        <div className="ve-mini__line ve-mini__line--title" />
        <div className="ve-mini__hero-img" />
      </div>
    );
  }
  if (type === 'team') {
    return (
      <div className="ve-mini ve-mini--cards">
        {[1, 2].map((i) => (
          <div key={i} className="ve-mini__card">
            <div className="ve-mini__card-avatar" />
            <div className="ve-mini__line ve-mini__line--sm" />
          </div>
        ))}
      </div>
    );
  }
  if (type === 'quotes') {
    return (
      <div className="ve-mini ve-mini--quotes">
        <div className="ve-mini__quote">"</div>
        <div className="ve-mini__line" />
        <div className="ve-mini__line ve-mini__line--short" />
      </div>
    );
  }
  if (type === 'icons') {
    return (
      <div className="ve-mini ve-mini--icons">
        {[1, 2, 3].map((i) => (
          <div key={i} className="ve-mini__icon-block">
            <div className="ve-mini__circle" />
            <div className="ve-mini__line ve-mini__line--sm" />
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default AddSectionModal;
