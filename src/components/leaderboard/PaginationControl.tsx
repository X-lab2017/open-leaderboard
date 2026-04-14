import { Icon } from '@iconify/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  /** Omit the label row; for toolbars next to other controls */
  compact?: boolean;
  /** Show prev/next and page dropdown even when totalPages is 1 */
  showWhenSinglePage?: boolean;
  /** Smaller bar height and text (toolbar next to other compact controls). */
  dense?: boolean;
};

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  compact = false,
  showWhenSinglePage = false,
  dense = false,
}: Props) {
  const { t } = useI18n();
  const selectPageLabel = t('selectPage');
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pendingRestore = useRef<{ scrollTop: number } | null>(null);

  useLayoutEffect(() => {
    if (!pendingRestore.current || !menuRef.current) return;
    const st = pendingRestore.current.scrollTop;
    pendingRestore.current = null;
    setOpen(true);
    requestAnimationFrame(() => {
      const menu = menuRef.current;
      if (!menu) return;
      menu.scrollTop = st;
      const activeItem = menu.querySelector('.page-dropdown-item.active');
      if (activeItem) {
        const menuHeight = menu.clientHeight;
        const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
        const itemHeight = (activeItem as HTMLElement).offsetHeight;
        const menuScrollTop = menu.scrollTop;
        if (itemOffsetTop < menuScrollTop) {
          menu.scrollTop = itemOffsetTop;
        } else if (itemOffsetTop + itemHeight > menuScrollTop + menuHeight) {
          menu.scrollTop = itemOffsetTop + itemHeight - menuHeight;
        }
      }
    });
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    // Capture phase so clicks inside panels that stopPropagation still close the menu.
    requestAnimationFrame(() => document.addEventListener('click', close, true));
    return () => document.removeEventListener('click', close, true);
  }, [open]);

  const positionMenu = () => {
    const btn = btnRef.current;
    const menu = menuRef.current;
    if (!btn || !menu) return;
    const rect = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 4 + 'px';
    menu.style.left = rect.left + 'px';
    menu.style.width = Math.max(rect.width, 80) + 'px';
    menu.style.right = 'auto';
  };

  useEffect(() => {
    if (!open) {
      if (menuRef.current) {
        const menu = menuRef.current;
        menu.style.position = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.width = '';
      }
      return;
    }

    positionMenu();
    let raf = 0;
    const schedulePosition = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        positionMenu();
      });
    };

    window.addEventListener('scroll', schedulePosition, true);
    window.addEventListener('resize', schedulePosition);

    const scrollables: Element[] = [];
    let el = btnRef.current?.parentElement ?? null;
    while (el) {
      const { overflow, overflowX, overflowY } = getComputedStyle(el);
      if (/(auto|scroll|overlay)/.test(overflow + overflowX + overflowY)) {
        scrollables.push(el);
      }
      el = el.parentElement;
    }
    const scrollingRoot = document.scrollingElement;
    if (scrollingRoot && !scrollables.includes(scrollingRoot)) {
      scrollables.push(scrollingRoot);
    }
    for (const node of scrollables) {
      node.addEventListener('scroll', schedulePosition, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedulePosition, true);
      window.removeEventListener('resize', schedulePosition);
      for (const node of scrollables) {
        node.removeEventListener('scroll', schedulePosition);
      }
    };
  }, [open]);

  if (!showWhenSinglePage && totalPages <= 1) return null;

  const bar = (
    <div
      id={compact ? undefined : 'paginationContainer'}
      className={`flex items-center bg-dark-700 border border-dark-600 overflow-hidden ${compact ? (dense ? 'h-7 rounded-md' : 'h-10 rounded-lg') : 'rounded-lg'}`}
    >
          <button
            type="button"
            id="prevPageBtn"
            disabled={currentPage === 1}
            onClick={() => {
              if (open && menuRef.current) pendingRestore.current = { scrollTop: menuRef.current.scrollTop };
              onPageChange(currentPage - 1);
            }}
            className={`time-picker-arrow flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${dense && compact ? 'w-7 h-7' : 'w-9 h-10'}`}
          >
            <Icon icon="mdi:chevron-left" className={dense && compact ? 'text-sm' : 'text-lg'} aria-hidden />
          </button>
          <div className="page-dropdown relative flex-1 min-w-0">
            <button
              ref={btnRef}
              type="button"
              id="pageDropdownBtn"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              className={`flex-1 flex items-center justify-center min-w-0 text-slate-200 hover:bg-dark-600/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset w-full ${dense && compact ? 'px-2 py-1 text-xs' : 'px-3 py-2.5 text-sm'}`}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={selectPageLabel}
            >
              <span className="truncate">
                {currentPage} / {totalPages}
              </span>
            </button>
            <div
              ref={menuRef}
              id="pageDropdownMenu"
              className={`page-dropdown-menu ${open ? 'show' : ''}${dense && compact ? ' page-dropdown-menu--dense' : ''}`}
              role="listbox"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <div
                  key={p}
                  role="option"
                  className={`page-dropdown-item ${p === currentPage ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    onPageChange(p);
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            id="nextPageBtn"
            disabled={currentPage === totalPages}
            onClick={() => {
              if (open && menuRef.current) pendingRestore.current = { scrollTop: menuRef.current.scrollTop };
              onPageChange(currentPage + 1);
            }}
            className={`time-picker-arrow flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${dense && compact ? 'w-7 h-7' : 'w-9 h-10'}`}
          >
            <Icon icon="mdi:chevron-right" className={dense && compact ? 'text-sm' : 'text-lg'} aria-hidden />
          </button>
    </div>
  );

  if (compact) {
    return bar;
  }

  return (
    <>
      <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
        <Icon icon="mdi:page-next" />
        <span>{t('pagination')}</span>
      </label>
      {bar}
    </>
  );
}
