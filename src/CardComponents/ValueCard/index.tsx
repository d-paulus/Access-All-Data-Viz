import styled from 'styled-components';
import { format } from 'd3-format';

interface Props {
  year: number;
  value: number;
  graphTitle: string;
  graphDescription?: string;
  suffix?: string;
  prefix?: string;
  labelFormat?: string;
  source: string;
  sourceLink: string;
}

const StatCardsEl = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 22.5rem;
  min-width: 22.5rem;
  min-height: 22.5rem;
  background-color: var(--gray-200);
  justify-content: space-between;
  font-size: 1.25rem;
  color: var(--black);
  transition: 300ms all;
  height: auto !important;
  scroll-snap-align: start;
`;

const StatEl = styled.h3`
  font-size: 4.375rem !important;
  line-height: 1 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 2px var(--black) !important;
  color: var(--gray-200) !important;
  letter-spacing: 0.05rem !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
  font-family: var(--fontFamilyHeadings) !important;
`;

const YearEl = styled.span`
  font-size: 2.5rem !important;
  line-height: 1.09 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 0px var(--black) !important;
  color: var(--gray-500) !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
`;

export function ValueCard(props: Props) {
  const {
    year,
    value,
    graphTitle,
    suffix,
    source,
    prefix,
    labelFormat,
    graphDescription,
    sourceLink,
  } = props;

  return (
    <StatCardsEl>
      <p className='undp-typography margin-bottom-00'>{graphTitle}</p>
      {graphDescription ? (
        <p
          className='undp-typography small-font margin-bottom-00'
          style={{ color: 'var(--gray-500)' }}
        >
          {graphDescription}
        </p>
      ) : null}
      <div
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StatEl>
          {prefix || ''}{' '}
          {Math.abs(value) < 1
            ? value
            : format(labelFormat || '.3s')(value).replace('G', 'B')}
          {suffix || ''} <YearEl>({year})</YearEl>
        </StatEl>
      </div>
      <p
        className='margin-top-05 undp-typography margin-bottom-00'
        style={{ fontSize: '1rem', color: 'var(--gray-600)' }}
      >
        Source:{' '}
        <a
          href={sourceLink}
          target='_blank'
          rel='noreferrer'
          style={{ fontSize: '1rem', color: 'var(--gray-600)' }}
          className='undp-style'
        >
          {source}
        </a>
      </p>
    </StatCardsEl>
  );
}
