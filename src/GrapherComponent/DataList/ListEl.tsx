import { useContext, useState } from 'react';
import sortBy from 'lodash.sortby';
import { format } from 'd3-format';
import { Input } from 'antd';
import {
  CountryGroupDataType,
  CtxDataType,
  IndicatorMetaDataType,
} from '../../Types';
import Context from '../../Context/Context';
import { TrendChartSmall } from './TrendChartSmall';

interface Props {
  data: CountryGroupDataType;
  indicators: IndicatorMetaDataType[];
}

export function ListEl(props: Props) {
  const { data, indicators } = props;

  const { signatureSolutionForDataList } = useContext(Context) as CtxDataType;
  const [search, updateSearch] = useState<string | undefined>(undefined);
  const filteredIndicatorsBySearch = search
    ? indicators.filter(d =>
        d.IndicatorLabel.toLowerCase().includes(search.toLowerCase() || ''),
      )
    : indicators;
  const filteredIndicators =
    signatureSolutionForDataList === 'All'
      ? filteredIndicatorsBySearch
      : filteredIndicatorsBySearch.filter(
          d => d.SignatureSolution.indexOf(signatureSolutionForDataList) !== -1,
        );
  const dataFilteredByCountry = data.indicators.map(d => ({
    ...d,
    yearlyData: sortBy(
      d.yearlyData.filter(el => el.value !== undefined),
      'year',
    ),
  }));
  const dataFiltered =
    signatureSolutionForDataList === 'All' ||
    dataFilteredByCountry === undefined
      ? dataFilteredByCountry
      : dataFilteredByCountry.filter(
          d =>
            filteredIndicators.findIndex(el => el.DataKey === d.indicator) !==
            -1,
        );
  const dataFilteredByMetaData = dataFiltered?.filter(
    d => indicators.findIndex(el => el.DataKey === d.indicator) !== -1,
  );
  return (
    <div>
      <div
        style={{
          padding: 'var(--spacing-06)',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--gray-400)',
          position: 'sticky',
          top: 0,
        }}
      >
        <Input
          className='undp-input'
          placeholder='Search an indicator'
          onChange={d => {
            updateSearch(d.target.value);
          }}
          value={search}
        />
      </div>
      <div>
        <div
          className='undp-table-head undp-table-head-sticky'
          style={{ top: '95px' }}
        >
          <div
            style={{ width: '50%' }}
            className='undp-table-head-cell undp-sticky-head-column'
          >
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              Indicator
            </div>
          </div>
          <div
            style={{ width: '30%' }}
            className='undp-table-head-cell undp-sticky-head-column align-right'
          >
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              Recent Value
            </div>
          </div>
          <div
            style={{ width: '20%' }}
            className='undp-table-head-cell undp-sticky-head-column'
          >
            <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              Trend
            </div>
          </div>
        </div>
        {sortBy(
          dataFilteredByMetaData.filter(d =>
            search
              ? indicators[
                  indicators.findIndex(el => el.DataKey === d.indicator)
                ].IndicatorLabel.toLowerCase().includes(search.toLowerCase())
              : d,
          ),
          d =>
            indicators[indicators.findIndex(el => el.DataKey === d.indicator)]
              .IndicatorLabel,
        ).map((d, i) =>
          indicators.findIndex(el => el.DataKey === d.indicator) !== -1 ? (
            <div
              key={i}
              className='undp-table-row'
              style={{ backgroundColor: 'var(--white)' }}
            >
              <div
                style={{ width: '50%', fontSize: '1rem' }}
                className='undp-table-row-cell'
              >
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  <p className='undp-typography'>
                    {
                      indicators[
                        indicators.findIndex(el => el.DataKey === d.indicator)
                      ].IndicatorLabel
                    }
                  </p>
                  <p
                    className='undp-typography'
                    style={{ fontSize: '0.75rem' }}
                  >
                    {
                      indicators[
                        indicators.findIndex(el => el.DataKey === d.indicator)
                      ].IndicatorDescription
                    }
                  </p>
                </div>
              </div>
              <div
                style={{ width: '30%' }}
                className='undp-table-row-cell align-right'
              >
                {d.yearlyData.length === 0 ? (
                  'NA'
                ) : (
                  <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <p className='undp-typography margin-bottom-00 bold'>
                      {indicators[
                        indicators.findIndex(el => el.DataKey === d.indicator)
                      ].LabelPrefix
                        ? `${
                            indicators[
                              indicators.findIndex(
                                el => el.DataKey === d.indicator,
                              )
                            ].LabelPrefix
                          } `
                        : ''}
                      {d.yearlyData[d.yearlyData.length - 1].value !== undefined
                        ? (d.yearlyData[d.yearlyData.length - 1]
                            .value as number) < 1000000
                          ? format(',')(
                              parseFloat(
                                (
                                  d.yearlyData[d.yearlyData.length - 1]
                                    .value as number
                                ).toFixed(2),
                              ),
                            ).replace(',', ' ')
                          : format('.3s')(
                              d.yearlyData[d.yearlyData.length - 1]
                                .value as number,
                            ).replace('G', 'B')
                        : d.yearlyData[d.yearlyData.length - 1].value}
                      {indicators[
                        indicators.findIndex(el => el.DataKey === d.indicator)
                      ].LabelSuffix && (
                        <span
                          className='label-suffix'
                          style={{ fontSize: '0.8rem' }}
                        >
                          {' '}
                          {
                            indicators[
                              indicators.findIndex(
                                el => el.DataKey === d.indicator,
                              )
                            ].LabelSuffix
                          }
                        </span>
                      )}
                    </p>
                    <p
                      className='undp-typography margin-bottom-00'
                      style={{
                        fontSize: '1rem',
                        color: 'var(--gray-500)',
                      }}
                    >
                      ({d.yearlyData[d.yearlyData.length - 1].year})
                    </p>
                  </div>
                )}
              </div>
              <div style={{ width: '20%' }} className='undp-table-row-cell'>
                <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  <TrendChartSmall
                    data={d.yearlyData}
                    indicator={
                      indicators[
                        indicators.findIndex(el => el.DataKey === d.indicator)
                      ]
                    }
                  />
                </div>
              </div>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
