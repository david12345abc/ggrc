export function buildSectionStyle(data) {
  const s = data?.settings || {};
  const style = {};
  if (s.bg_color) style.backgroundColor = s.bg_color;
  if (s.margin_bottom) style.marginBottom = `${s.margin_bottom}px`;
  if (data?.background_image_url) {
    style.backgroundImage = `url(${data.background_image_url})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }
  return Object.keys(style).length ? style : undefined;
}

export function buildTitleStyle(data) {
  const s = data?.settings || {};
  return s.title_color ? { color: s.title_color } : undefined;
}

const ALIGN_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch',
};

export function buildGridStyle(data) {
  const align = data?.settings?.cards_align;
  if (!align || align === 'stretch') return undefined;
  return { justifyContent: ALIGN_MAP[align] };
}

export function getGridClassName(data, base) {
  const align = data?.settings?.cards_align;
  if (!align || align === 'stretch') return base;
  return `${base} ${base}--aligned`;
}
