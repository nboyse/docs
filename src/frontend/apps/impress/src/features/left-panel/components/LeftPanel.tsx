import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { createGlobalStyle, css } from 'styled-components';

import { Box, SeparatedSection } from '@/components';
import { useCunninghamTheme } from '@/cunningham';
import { ButtonLogin } from '@/features/auth';
import { HEADER_HEIGHT } from '@/features/header/conf';
import { LanguagePicker } from '@/features/language';
import { useResponsiveStore } from '@/stores';
import { useLeftPanelStore } from '../stores';
import { LeftPanelContent } from './LeftPanelContent';
import { LeftPanelHeader } from './LeftPanelHeader';

const mobileOverflowStyle = {
  overflow: 'hidden'
};

export const LeftPanel = () => {
  const { isDesktop } = useResponsiveStore();
  
  const { colorsTokens, spacingsTokens } = useCunninghamTheme();
  const { togglePanel, isPanelOpen } = useLeftPanelStore();
  const pathname = usePathname();

  useEffect(() => {
    togglePanel(false);
  }, [pathname, togglePanel]);

  // Apply overflow hidden to body when mobile panel is open
  useEffect(() => {
    if (!isDesktop && isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPanelOpen, isDesktop]);

  return (
    <>
      {isDesktop && (
        <div 
          className="govuk-grid-column-one-quarter"
          data-testid="left-panel-desktop"
          style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            width: '300px',
            minWidth: '300px',
            overflow: 'hidden',
            borderRight: `1px solid ${colorsTokens['greyscale-200']}`,
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <LeftPanelHeader />
          </div>
          <LeftPanelContent />
        </div>
      )}

      {!isDesktop && (
        <div
          className="govuk-left-panel govuk-left-panel--mobile"
          style={{
            zIndex: 999,
            width: '100dvw',
            height: `calc(100dvh - 52px)`,
            borderRight: '1px solid var(--c--theme--colors--greyscale-200)',
            position: 'fixed',
            transform: isPanelOpen ? 'translateX(0)' : 'translateX(-100dvw)',
            backgroundColor: 'var(--c--theme--colours--greyscale-000)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <div
            data-testid="left-panel-mobile"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'centre',
              alignItems: 'centre',
              gap: spacingsTokens['base'],
            }}
          >
            <LeftPanelHeader />
            <LeftPanelContent />

            <div className="govuk-section-break govuk-section-break--m">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'centre',
                  alignItems: 'centre',
                  gap: spacingsTokens['sm'],
                }}
              >
                <ButtonLogin />
                <LanguagePicker />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};