import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import IconDocs from '@/assets/icons/icon-docs.svg';
import { Box, StyledLink } from '@/components/';
import { useCunninghamTheme } from '@/cunningham';
import { ButtonLogin } from '@/features/auth';
import { LanguagePicker } from '@/features/language';
import { useResponsiveStore } from '@/stores';

import { HEADER_HEIGHT } from '../conf';

import { ButtonTogglePanel } from './ButtonTogglePanel';
import { LaGaufre } from './LaGaufre';
import { Title } from './Title';

export const Header = () => {
  const { t } = useTranslation();
  const { spacingsTokens, colorsTokens } = useCunninghamTheme();
  const { isDesktop } = useResponsiveStore();

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        {!isDesktop && <ButtonTogglePanel />}

        <div className="govuk-header__logo">
          <a href="/" className="govuk-header__link govuk-header__link--homepage">
            <span className="govuk-header__logotype">
              <IconDocs
                aria-label={t('Docs Logo')}
                width={32}
                color={colorsTokens['primary-text']}
              />
              <Title />
            </span>
          </a>
        </div>

        <div className="govuk-header__content">
          {!isDesktop ? (
            <div style={{ display: 'flex', gap: spacingsTokens['sm'] }}>
              <LaGaufre />
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'centre', 
              gap: spacingsTokens['sm'] 
            }}>
              <ButtonLogin />
              <LanguagePicker />
              <LaGaufre />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};