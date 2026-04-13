import { Icon } from '@iconify/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export function PaginationControl({ currentPage, totalPages, onPageChange }: Props) {
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
    requestAnimationFrame(() => document.addEventListener('click', close));
    return () => document.removeEventListener('click', close);
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
    if (open) positionMenu();
    else if (menuRef.current) {
      const menu = menuRef.current;
      menu.style.position = '';
      menu.style.top = '';
      menu.style.left = '';
      menu.style.width = '';
    }
  }, [open]);

  if (totalPages <= 1) return null;

  return (
    <>
      <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-400">
        <Icon icon="mdi:page-next" />
        <span>{t('pagination')}</span>
      </label>
      <div id="paginationContainer">
        <div className="flex items-center bg-dark-700 border border-dark-600 rounded-lg overflow-hidden">
          <button
            type="button"
            id="prevPageBtn"
            disabled={currentPage === 1}
            onClick={() => {
              if (open && menuRef.current) pendingRestore.current = { scrollTop: menuRef.current.scrollTop };
              onPageChange(currentPage - 1);
            }}
            className="time-picker-arrow flex items-center justify-center w-9 h-10 flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <Icon icon="mdi:chevron-left" className="text-lg" aria-hidden />
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
              className="flex-1 flex items-center justify-center min-w-0 px-3 py-2.5 text-sm text-slate-200 hover:bg-dark-600/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset w-full"
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
              className={`page-dropdown-menu ${open ? 'show' : ''}`}
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
            className="time-picker-arrow flex items-center justify-center w-9 h-10 flex-shrink-0 text-slate-400 hover:text-accent hover:bg-dark-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <Icon icon="mdi:chevron-right" className="text-lg" aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
}
