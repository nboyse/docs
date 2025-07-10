import { useTranslation } from 'react-i18next';
import { InView } from 'react-intersection-observer';
import { DocDefaultFilter, useInfiniteDocs } from '@/docs/doc-management';
import { useResponsiveStore } from '@/stores';
import { useResponsiveDocGrid } from '../hooks/useResponsiveDocGrid';
import { DocsGridItem } from './DocsGridItem';
import { DocsGridLoader } from './DocsGridLoader';
import { Fragment } from 'react';

type DocsGridProps = {
  target?: DocDefaultFilter;
};

export const DocsGrid = ({
  target = DocDefaultFilter.ALL_DOCS,
}: DocsGridProps) => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsiveStore();
  const { flexLeft, flexRight } = useResponsiveDocGrid();
  const {
    data,
    isFetching,
    isRefetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteDocs({
    page: 1,
    ...(target &&
      target !== DocDefaultFilter.ALL_DOCS && {
        is_creator_me: target === DocDefaultFilter.MY_DOCS,
      }),
  });

  const loading = isFetching || isLoading;
  const hasDocs = data?.pages.some((page) => page.results.length > 0);

  const loadMore = (inView: boolean) => {
    if (!inView || loading) {
      return;
    }
    void fetchNextPage();
  };

  const title =
    target === DocDefaultFilter.MY_DOCS
      ? t('My docs')
      : target === DocDefaultFilter.SHARED_WITH_ME
      ? t('Shared with me')
      : t('All docs');

  return (
    <div 
      className="govuk-grid-column-three-quarters govuk-!-margin-left-0" 
      style={{
        position: 'relative',
        maxWidth: '960px',
        maxHeight: 'calc(100vh - 52px - 2rem)',
        display: 'flex',
        alignItems: 'centre'
      }}
    >
      <DocsGridLoader isLoading={isRefetching || loading} />

      <div 
        className={`govuk-panel ${!isDesktop ? 'govuk-panel--no-border' : ''}`}
        role="grid"
        data-testid="docs-grid"
        style={{
          height: '100%',
          width: '100%',
          padding: isDesktop ? '20px 30px 30px' : '20px 15px 30px'
        }}
      >
        <h2 className="govuk-heading-m">
          {title}
        </h2>

        {!hasDocs && !loading && (
          <div className="govuk-body" style={{ textAlign: 'centre', padding: '15px 0' }}>
            <p className="govuk-body-s govuk-!-font-weight-bold">
              {t('No documents found')}
            </p>
          </div>
        )}

        {hasDocs && (
          <div style={{ overflow: 'auto', gap: '6px' }}>
            <div 
              className="govuk-grid-row govuk-!-padding-horizontal-2" 
              style={{ gap: '10px', display: 'flex' }}
              data-testid="docs-grid-header"
            >
              <div style={{ flex: flexLeft, padding: '5px' }}>
                <p className="govuk-body-s govuk-!-font-weight-medium">
                  {t('Name')}
                </p>
              </div>

              {isDesktop && (
                <div style={{ flex: flexRight, padding: '5px 0' }}>
                  <p className="govuk-body-s govuk-!-font-weight-medium">
                    {t('Updated at')}
                  </p>
                </div>
              )}
            </div>

            {data?.pages.map((currentPage, pageIndex) => (
              // Using pageIndex as part of key since we need unique keys for mapped elements
              <Fragment key={`page-${pageIndex}`}>
                {currentPage.results.map((doc) => (
                  <DocsGridItem doc={doc} key={doc.id} />
                ))}
              </Fragment>
            ))}

            {hasNextPage && !loading && (
              <InView
                data-testid="infinite-scroll-trigger"
                as="div"
                onChange={loadMore}
              >
                {!isFetching && hasNextPage && (
                  <button 
                    className="govuk-button" 
                    data-module="govuk-button"
                    onClick={() => void fetchNextPage}
                  >
                    {t('More docs')}
                  </button>
                )}
              </InView>
            )}
          </div>
        )}
      </div>
    </div>
  );
};