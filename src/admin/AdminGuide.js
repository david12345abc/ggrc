import React, { useEffect, useState, useCallback } from 'react';
import {
  FiBookOpen, FiCompass, FiLayers, FiFilePlus, FiUserPlus, FiSettings,
  FiMail, FiImage, FiPhone, FiEdit3, FiGrid, FiMousePointer,
  FiGlobe, FiMove, FiLink2, FiExternalLink, FiChevronRight,
} from 'react-icons/fi';
import './css/admin-guide.css';

const SECTIONS = [
  { id: 'sidebar',         icon: FiCompass,       title: '1. Sidebar navigation' },
  { id: 'pages-vs-your',   icon: FiLayers,        title: '2. Pages vs. Your Pages' },
  { id: 'new-page',        icon: FiFilePlus,      title: '3. Creating a new page' },
  { id: 'users',           icon: FiUserPlus,      title: '4. Adding a new user (superadmin)' },
  { id: 'site-settings',   icon: FiSettings,      title: '5. Site Settings overview' },
  { id: 'smtp',            icon: FiMail,          title: '6. Email (SMTP) configuration' },
  { id: 'logo',            icon: FiImage,         title: '7. Changing the site logo' },
  { id: 'contact',         icon: FiPhone,         title: '8. Contact page info' },
  { id: 'fill-page',       icon: FiEdit3,         title: '9. Filling a page with content' },
  { id: 'section-types',   icon: FiGrid,          title: '10. Section types (Choose Section Type)' },
  { id: 'section-details', icon: FiMousePointer,  title: '11. Each section type in detail' },
  { id: 'language',        icon: FiGlobe,         title: '12. How language switching works' },
  { id: 'edit-delete',     icon: FiMove,          title: '13. Editing, deleting & reordering blocks' },
  { id: 'link-page',       icon: FiLink2,         title: '14. Linking a page to a card' },
  { id: 'link-url',        icon: FiExternalLink,  title: '15. Linking an external URL to a card' },
];

const AdminGuide = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const handleScrollTo = useCallback((id) => {
    const el = document.getElementById(`guide-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handle = () => {
      let bestId = SECTIONS[0].id;
      let bestDist = Infinity;
      SECTIONS.forEach((s) => {
        const el = document.getElementById(`guide-${s.id}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 100);
        if (rect.top <= 180 && dist < bestDist) {
          bestDist = dist;
          bestId = s.id;
        }
      });
      setActiveId(bestId);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div className="ag-wrap">
      <aside className="ag-toc">
        <div className="ag-toc__title">
          <FiBookOpen /> <span>Contents</span>
        </div>
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`ag-toc__item ${activeId === s.id ? 'ag-toc__item--active' : ''}`}
              onClick={() => handleScrollTo(s.id)}
            >
              <s.icon /> <span>{s.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <article className="ag-article">
        <header className="ag-hero">
          <h1>Admin Guide</h1>
          <p>A complete, step-by-step walkthrough of how the admin panel works. Keep this page bookmarked — it covers every feature you will use day-to-day.</p>
        </header>

        <Section id="sidebar" icon={FiCompass} title="1. How the left sidebar is organised">
          <p>The sidebar on the left is your main navigation. It is divided into clear groups:</p>
          <ul className="ag-list">
            <li><strong>Pages</strong> — core public pages of the website (Home, About, Services, Team, Blog, Contact). These always appear in the site's top menu.</li>
            <li><strong>Your Pages</strong> — custom pages that you create yourself. They are <em>not</em> in the top menu; their URL only exists because you made them. This block can be collapsed with the chevron on the left of its title.</li>
            <li><strong>Settings</strong> — <em>Site settings</em> opens the global site configuration; <em>Users</em> (superadmin only) lets you manage admins; <em>Admin Guide</em> opens this page.</li>
            <li><strong>Footer</strong> — your username, role and a <em>Logout</em> button.</li>
          </ul>
          <Callout kind="tip">
            The sidebar saves its collapse state in your browser — so the next time you log in, <em>Your Pages</em> will stay in the position you left it.
          </Callout>
        </Section>

        <Section id="pages-vs-your" icon={FiLayers} title="2. Pages vs. Your Pages">
          <div className="ag-compare">
            <div className="ag-compare__col">
              <h3>Pages</h3>
              <ul className="ag-list">
                <li>Built-in pages that <strong>cannot be deleted</strong>.</li>
                <li>Appear in the site header menu (and footer where needed).</li>
                <li>Have a fixed URL, e.g. <code>/services</code>, <code>/about</code>, <code>/blog</code>.</li>
                <li>You can freely edit their sections, but the page itself stays.</li>
              </ul>
            </div>
            <div className="ag-compare__col">
              <h3>Your Pages</h3>
              <ul className="ag-list">
                <li>Pages you create from scratch via <strong>+ New Page</strong>.</li>
                <li>Do <strong>not</strong> appear in the site menu automatically — visitors reach them only by a direct link.</li>
                <li>Have a custom slug, e.g. <code>/page/pricing</code>.</li>
                <li>Can be deleted (trash icon next to the name).</li>
              </ul>
            </div>
          </div>
          <Callout kind="tip">
            "Your Pages" are perfect for landing pages, promotions, or any content you want to link from a button or card — without cluttering the main menu.
          </Callout>
        </Section>

        <Section id="new-page" icon={FiFilePlus} title="3. Creating a new page">
          <p>To create a fresh page under <em>Your Pages</em>:</p>
          <Steps>
            <Step n={1}><strong>Open the sidebar</strong> and click <strong>+ New Page</strong>.</Step>
            <Step n={2}>Fill in <strong>Page Title</strong> — this is what you will see in the sidebar and in the H1 on the page.</Step>
            <Step n={3}>The <strong>URL Slug</strong> is generated automatically. You can override it (use only latin letters, digits and hyphens).</Step>
            <Step n={4}>Click <strong>Create Page</strong>. You are taken straight into the editor where you can add sections.</Step>
          </Steps>
          <Callout kind="info">
            After creation the URL is <code>/page/&lt;slug&gt;</code>. You can use that URL anywhere — in a card link, a button, a menu item. See sections 14 and 15 below.
          </Callout>
        </Section>

        <Section id="users" icon={FiUserPlus} title="4. Adding a new user (superadmin only)">
          <p>Only <strong>superadmins</strong> see the <em>Users</em> item in the sidebar. Regular admins do not have access to this page.</p>
          <Steps>
            <Step n={1}>Go to <strong>Users</strong> in the sidebar.</Step>
            <Step n={2}>Click <strong>+ Add User</strong>.</Step>
            <Step n={3}>Enter <strong>Username</strong>, <strong>Email</strong> and <strong>Password</strong>.</Step>
            <Step n={4}>Pick a <strong>Role</strong>:
              <ul className="ag-list ag-list--nested">
                <li><strong>Guest</strong> — no admin access (placeholder for read-only use).</li>
                <li><strong>Administrator</strong> — can edit all pages, sections and site settings, but cannot manage users.</li>
                <li><strong>Super Administrator</strong> — full access, including user management.</li>
              </ul>
            </Step>
            <Step n={5}>Press <strong>Create</strong>. The new user can log in at <code>/admin-panel/login</code> immediately.</Step>
          </Steps>
          <Callout kind="warn">
            Do not share superadmin credentials. Create a separate account for each person who needs to edit the site.
          </Callout>
        </Section>

        <Section id="site-settings" icon={FiSettings} title="5. What Site Settings contains">
          <p>Site Settings holds values that appear across the entire site (header, footer, contact page). Inside you will find four blocks:</p>
          <ul className="ag-list">
            <li><strong>Contact information</strong> — email, phone numbers, address (full and short).</li>
            <li><strong>Social networks</strong> — URLs for Instagram, LinkedIn, Facebook, plus a YouTube video ID used in the About section.</li>
            <li><strong>Email (SMTP)</strong> — credentials used to send emails from the contact form (see section 6).</li>
            <li><strong>Logos</strong> — dark-background logo and light-background logo (see section 7).</li>
          </ul>
          <p>Click <strong>Save changes</strong> at the top of the page after edits. A green "Saved" badge confirms the save.</p>
        </Section>

        <Section id="smtp" icon={FiMail} title="6. Email (SMTP) block — how to fill it correctly">
          <p>This block controls how contact-form submissions are delivered. Fill each field carefully:</p>
          <Table
            rows={[
              ['Backend',       'SMTP — sends real letters. Console — only prints to the server log (testing mode).'],
              ['SMTP host',     'Outgoing server. For Gmail: smtp.gmail.com.'],
              ['Port',          '587 for TLS, 465 for SSL.'],
              ['Use TLS / SSL', 'Toggle one depending on port.'],
              ['SMTP username', 'The email address used to sign in to the mailbox.'],
              ['SMTP password', 'For Gmail use an app-password (not your Google password).'],
              ['From address',  'Appears in the "From" field of the delivered letter. If empty, falls back to SMTP username.'],
              ['Contact inbox', 'Where contact-form messages are delivered (often the same as SMTP username).'],
              ['Timeout',       'How many seconds to wait before giving up on an SMTP connection.'],
            ]}
          />
          <Callout kind="tip">
            After saving, use <strong>Send test</strong> at the bottom to verify the whole chain. If the test fails, the error message tells you exactly which field is wrong.
          </Callout>
        </Section>

        <Section id="logo" icon={FiImage} title="7. Changing the site logo">
          <p>The site uses two logos:</p>
          <ul className="ag-list">
            <li><strong>Logo (dark background / default)</strong> — shown over dark sections, e.g. the main hero.</li>
            <li><strong>Logo (light background / purple)</strong> — shown when the page background is light.</li>
          </ul>
          <Steps>
            <Step n={1}>Open <strong>Site settings → Logos</strong>.</Step>
            <Step n={2}>Click the logo you want to change. A file picker opens.</Step>
            <Step n={3}>Pick a PNG/SVG/JPG file. It uploads and appears as a preview.</Step>
            <Step n={4}>Click <strong>Save changes</strong>. The new logo is live on the site immediately.</Step>
          </Steps>
          <Callout kind="info">
            PNG or SVG with a transparent background looks best. Keep the height around 40–80px for crisp rendering in the header.
          </Callout>
        </Section>

        <Section id="contact" icon={FiPhone} title="8. Editing the Contact page info">
          <p>Almost everything on the Contact page is driven by <strong>Site settings → Contact information</strong>:</p>
          <ul className="ag-list">
            <li><strong>Email</strong> — displayed on the Contact page, in the header menu and in the footer.</li>
            <li><strong>Phone numbers</strong> — a reorderable list (move up/down, add, delete). All of them show on the Contact page and in the footer.</li>
            <li><strong>Phone (header display)</strong> — optional: a single number to show in the header when space is limited.</li>
            <li><strong>Address (full)</strong> — shown on the Contact page.</li>
            <li><strong>Address (short)</strong> — shown in the footer / tight spaces.</li>
          </ul>
          <p>If you need a <em>custom block</em> on the Contact page (e.g. a map note or working hours), open the Contact page editor and add a section there — the text fields from Site settings will remain untouched.</p>
        </Section>

        <Section id="fill-page" icon={FiEdit3} title="9. Filling a page with content">
          <p>Any page — built-in or custom — is built from <strong>sections</strong>. Each section is an independent block with its own type, content and styling.</p>
          <Steps>
            <Step n={1}>Open the page from the sidebar (e.g. <strong>About</strong>).</Step>
            <Step n={2}>Click <strong>+ Add section at top</strong> (or <strong>+ Add section</strong> between existing blocks).</Step>
            <Step n={3}>Choose a section type in the modal (see section 10).</Step>
            <Step n={4}>Type the section title and press <strong>Create Section</strong>.</Step>
            <Step n={5}>The section is added — click its <strong>pencil icon</strong> to open the editor and fill in content, cards, colours, etc.</Step>
            <Step n={6}>Click <strong>Save</strong> inside the editor. The page on the public site updates immediately.</Step>
          </Steps>
        </Section>

        <Section id="section-types" icon={FiGrid} title="10. Choose Section Type — what each option means">
          <p>When you add a new section, the modal shows these 10 types:</p>
          <div className="ag-type-grid">
            {TYPE_LIST.map((t) => (
              <div key={t.key} className="ag-type-card">
                <strong>{t.label}</strong>
                <span>{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="section-details" icon={FiMousePointer} title="11. Each section type in detail">
          <p>Below is exactly what differs between block types and when to use each one.</p>

          <SubBlock title="Text Block">
            A single block with a title and a body. The body supports <em>plain text</em> or full <strong>Rich text (HTML)</strong> mode with a live preview, quick snippets (H2, H3, paragraph, bullet list, check list, quote, bold, italic, link) and per-section font, size, colour and alignment. Use it for articles, about-us paragraphs, policies.
          </SubBlock>

          <SubBlock title="Cards with Images (card_grid)">
            A responsive grid of cards, each with an image, title, description and optional link. Great for "What we do", feature lists, photo galleries.
          </SubBlock>

          <SubBlock title="Card Carousel">
            Same cards as the grid, but presented as a swipeable carousel. Has extra settings: <em>Autoplay</em>, <em>Delay (ms)</em>, <em>Loop</em>, <em>Slides per view (desktop)</em>. Use it when cards should attract attention and there are more than fit on one screen.
          </SubBlock>

          <SubBlock title="Hero Banner">
            A full-width banner that sits at the top of a page. Has a large title, optional subtitle, and a background image. Drag the image inside the <em>Reposition image</em> tool to focus on the right part of the photo.
          </SubBlock>

          <SubBlock title="Services">
            Service-catalog layout: cards with an image, title and a "Read more" style link. Use it on the Services page or as a "What we offer" section on Home.
          </SubBlock>

          <SubBlock title="Team Members">
            Team cards with photo, name and role. Supports <em>drag-and-drop reordering</em> — grab the handle on a card to change the order.
          </SubBlock>

          <SubBlock title="Testimonials">
            Quote cards: quote text + author name. Perfect for patient/client reviews.
          </SubBlock>

          <SubBlock title="Blog Posts">
            Blog-style cards: image, title, short excerpt and a "Read more" link that leads to the full article page.
          </SubBlock>

          <SubBlock title="Features with Icons (why_choose_us)">
            Small cards with an <strong>icon</strong> instead of an image, plus title and short description. Pick the icon from the icon selector on each card (Doctor, Hospital, Caring Heart, Globe, Award, Microscope, World, Heart, Users, Prayer).
          </SubBlock>

          <SubBlock title="YouTube Video">
            A clean YouTube player. Paste the full YouTube link (<code>https://www.youtube.com/watch?v=…</code> or <code>https://youtu.be/…</code>). An optional title can be added above the video.
          </SubBlock>

          <Callout kind="tip">
            Every section also has a <strong>Style Settings</strong> panel: Title colour, Background colour, Bottom margin, and (for card-based sections) Cards alignment and optional Background image.
          </Callout>
        </Section>

        <Section id="language" icon={FiGlobe} title="12. How the language switch affects content">
          <p>The public site has three languages: <strong>English / Russian / Armenian</strong>. Content is stored <em>per language</em>, so translations are real translations — not machine-generated overlays.</p>
          <ul className="ag-list">
            <li>Open any page editor — at the top you can switch the editing language.</li>
            <li>If a language has no content yet, you will see <em>"No content for [lang] yet. Click + to add sections."</em> Add sections and they become the content for <em>that</em> language only.</li>
            <li>Switching language on the public site shows the sections saved under that language code.</li>
            <li>Logos, phone numbers, email and SMTP are <strong>shared</strong> — they are the same in every language.</li>
          </ul>
          <Callout kind="warn">
            Saving a section saves it only for the currently selected language. If you also want the English version to change, switch the editor to English and repeat the edit there.
          </Callout>
        </Section>

        <Section id="edit-delete" icon={FiMove} title="13. Editing, deleting and reordering blocks">
          <p>Each section on a page has a small toolbar on hover:</p>
          <ul className="ag-list">
            <li><strong>Move up / Move down</strong> — reorder the section on the page.</li>
            <li><strong>Edit</strong> (pencil) — opens the section editor.</li>
            <li><strong>Delete</strong> (trash) — asks for confirmation and removes the section. This cannot be undone.</li>
          </ul>
          <p>Inside a card-based section you can also:</p>
          <ul className="ag-list">
            <li>Delete a single card (trash icon on the card).</li>
            <li>Reorder Team cards by dragging the <em>Reorder</em> handle.</li>
          </ul>
          <Callout kind="info">
            For pages where the order of cards matters (Services, Blog), the order you see in the admin is the same order the public site shows.
          </Callout>
        </Section>

        <Section id="link-page" icon={FiLink2} title="14. Linking a page to a card">
          <p>You can make any card clickable so it opens one of <em>your</em> pages (or a built-in site page):</p>
          <Steps>
            <Step n={1}>Edit a card-based section (Services, Blog, Cards with Images, etc.).</Step>
            <Step n={2}>On the card, click <strong>Attach link (page or URL)</strong>.</Step>
            <Step n={3}>Switch the mode to <strong>Your Page</strong> (or <strong>Site page</strong> for built-in pages).</Step>
            <Step n={4}>Pick the page from the dropdown — the list shows all pages you created plus the main ones.</Step>
            <Step n={5}>Optionally set the <strong>Link text</strong> (e.g. <em>READ MORE</em>) shown as the card's CTA.</Step>
            <Step n={6}>Click <strong>Save</strong>. The whole card is now clickable and opens the selected page.</Step>
          </Steps>
          <Callout kind="tip">
            If you delete a "Your Page" that was linked from a card, the card becomes non-clickable — remember to re-attach the link afterwards.
          </Callout>
        </Section>

        <Section id="link-url" icon={FiExternalLink} title="15. Linking an external URL to a card">
          <p>If you want a card to open an <strong>external website</strong> (or a specific site path that is not a page), use URL mode:</p>
          <Steps>
            <Step n={1}>Open the card's link editor (as in step 14).</Step>
            <Step n={2}>Pick <strong>External URL</strong>.</Step>
            <Step n={3}>Paste the full link, e.g. <code>https://wa.me/37495520055</code> or an internal path like <code>/contact</code>.</Step>
            <Step n={4}>Optionally adjust the link text.</Step>
            <Step n={5}>Save. External links open in the same tab by default.</Step>
          </Steps>
          <Callout kind="info">
            A card <em>without</em> a link is not clickable — the whole block stays static. Use <strong>Remove link</strong> in the link editor to detach a previously-set link.
          </Callout>
        </Section>

        <footer className="ag-footer">
          <p>Need something that is not covered here? Contact your developer — the admin panel is actively maintained and new features can be added on request.</p>
        </footer>
      </article>
    </div>
  );
};

const Section = ({ id, icon: Icon, title, children }) => (
  <section id={`guide-${id}`} className="ag-section">
    <h2 className="ag-section__title">
      <span className="ag-section__icon"><Icon /></span>
      <span>{title}</span>
    </h2>
    <div className="ag-section__body">{children}</div>
  </section>
);

const Steps = ({ children }) => <ol className="ag-steps">{children}</ol>;

const Step = ({ n, children }) => (
  <li className="ag-step">
    <span className="ag-step__num">{n}</span>
    <div className="ag-step__text">{children}</div>
  </li>
);

const Callout = ({ kind = 'info', children }) => (
  <div className={`ag-callout ag-callout--${kind}`}>
    <FiChevronRight className="ag-callout__chev" />
    <div>{children}</div>
  </div>
);

const Table = ({ rows }) => (
  <div className="ag-table-wrap">
    <table className="ag-table">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}><th>{k}</th><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SubBlock = ({ title, children }) => (
  <div className="ag-subblock">
    <h3>{title}</h3>
    <p>{children}</p>
  </div>
);

const TYPE_LIST = [
  { key: 'text_block',   label: 'Text Block',          desc: 'Title + body (plain or rich HTML). Custom font, size, colour, alignment.' },
  { key: 'card_grid',    label: 'Cards with Images',   desc: 'Grid of cards — image, title, text, optional link.' },
  { key: 'card_carousel',label: 'Card Carousel',       desc: 'Swipeable carousel of cards. Autoplay, loop, slides-per-view.' },
  { key: 'hero',         label: 'Hero Banner',         desc: 'Big top banner: title + background image.' },
  { key: 'services',     label: 'Services',            desc: 'Service cards: image + title + link.' },
  { key: 'team',         label: 'Team Members',        desc: 'Team cards with photo, name, role. Drag to reorder.' },
  { key: 'testimonials', label: 'Testimonials',        desc: 'Patient/client reviews: quote + author.' },
  { key: 'blog',         label: 'Blog Posts',          desc: 'Blog cards: image + title + Read more link.' },
  { key: 'why_choose_us',label: 'Features with Icons', desc: 'Icon cards — pick from the built-in icon set.' },
  { key: 'video_block',  label: 'YouTube Video',       desc: 'Embed a YouTube video by URL.' },
];

export default AdminGuide;
