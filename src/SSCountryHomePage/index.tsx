/* eslint-disable jsx-a11y/iframe-has-title */
import { useState, useEffect } from 'react';
import flattenDeep from 'lodash.flattendeep';
import sortedUniq from 'lodash.sorteduniq';
import { json } from 'd3-request';
import uniqBy from 'lodash.uniqby';
import { queue } from 'd3-queue';
import { Select } from 'antd';
import {
  CountryGroupDataType,
  IndicatorMetaDataType,
  IndicatorMetaDataWithYear,
  CountryListType,
  CountryTaxonomyDataType,
} from '../Types';

import { COUNTRIES_BY_UNDP_REGIONS, METADATALINK } from '../Constants';
import CountryHomePageContext from './CountryHomePage';

interface Props {
  signatureSolution?: string;
  region?: string;
}

function CountryHomePage(props: Props) {
  const { signatureSolution, region } = props;
  const [countryId, setCountryId] = useState(
    region
      ? COUNTRIES_BY_UNDP_REGIONS[
          COUNTRIES_BY_UNDP_REGIONS.findIndex(
            d => d.region === `UNDP_${region}`,
          )
        ].Countries[0]
      : 'AFG',
  );
  const [finalData, setFinalData] = useState<
    CountryGroupDataType[] | undefined
  >(undefined);
  const [indicatorsList, setIndicatorsList] = useState<
    IndicatorMetaDataWithYear[] | undefined
  >(undefined);
  const [regionList, setRegionList] = useState<string[] | undefined>(undefined);
  const [countryList, setCountryList] = useState<CountryListType[] | undefined>(
    undefined,
  );
  const [countryTaxonomy, setCountryTaxonomyList] = useState<
    CountryListType[] | undefined
  >(undefined);
  const [indicatorMetaData, setIndicatorMetaData] = useState<
    IndicatorMetaDataType[] | undefined
  >(undefined);

  useEffect(() => {
    queue()
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
      )
      .defer(json, METADATALINK)
      .await(
        (
          err: any,
          data: CountryTaxonomyDataType[],
          indicatorMetaDataFromFIle: IndicatorMetaDataType[],
        ) => {
          if (err) throw err;
          const filteredCountry = region
            ? data.filter(
                d =>
                  COUNTRIES_BY_UNDP_REGIONS[
                    COUNTRIES_BY_UNDP_REGIONS.findIndex(
                      el => el.region === `UNDP_${region}`,
                    )
                  ].Countries.indexOf(d['Alpha-3 code-1']) !== -1,
              )
            : data;
          setCountryTaxonomyList(
            filteredCountry.map(d => ({
              name: d['Country or Area'],
              code: d['Alpha-3 code-1'],
            })),
          );
          setIndicatorMetaData(indicatorMetaDataFromFIle);
        },
      );
  }, []);

  useEffect(() => {
    if (indicatorMetaData) {
      setFinalData(undefined);
      json(
        `https://raw.githubusercontent.com/UNDP-Data/Access-All-Data-Data-Repo/main/countryData/${countryId}.json`,
        (err: any, data: CountryGroupDataType) => {
          if (err) throw err;
          setCountryList(
            [data].map(d => ({
              name: d['Country or Area'],
              code: d['Alpha-3 code'],
            })),
          );
          setRegionList(
            uniqBy([data], d => d['Group 2']).map(d => d['Group 2']),
          );
          const indicatorsFilteredBySS = signatureSolution
            ? indicatorMetaData.filter(
                d => d.SignatureSolution.indexOf(signatureSolution) !== -1,
              )
            : indicatorMetaData;
          const indicatorWithYears: IndicatorMetaDataWithYear[] =
            indicatorsFilteredBySS.map(d => {
              const years: number[][] = [];
              [data].forEach(el => {
                const indYears = el.indicators[
                  el.indicators.findIndex(ind => ind.indicator === d.DataKey)
                ]?.yearlyData.map(year => year.year);
                if (indYears) years.push(indYears);
              });
              return {
                ...d,
                years: sortedUniq(flattenDeep(years)),
              };
            });
          setFinalData([
            {
              ...data,
              indicators: data.indicators.filter(
                el =>
                  indicatorsFilteredBySS.findIndex(
                    ind => ind.DataKey === el.indicator,
                  ) !== -1,
              ),
            },
          ]);
          setIndicatorsList(indicatorWithYears.filter(d => d.years.length > 0));
        },
      );
    }
  }, [countryId, indicatorMetaData]);
  return (
    <div>
      {countryTaxonomy ? (
        <>
          <Select
            className='undp-select margin-bottom-05'
            placeholder='Select A Country'
            showSearch
            value={
              countryTaxonomy[
                countryTaxonomy.findIndex(el => el.code === countryId)
              ].name
            }
            onChange={d => {
              setCountryId(
                countryTaxonomy[countryTaxonomy.findIndex(el => el.name === d)]
                  .code,
              );
            }}
          >
            {countryTaxonomy.map((d, i) => (
              <Select.Option
                className='undp-select-option'
                value={d.name}
                key={i}
              >
                {d.name}
              </Select.Option>
            ))}
          </Select>
          {indicatorsList && finalData && regionList && countryList ? (
            <div className='undp-container'>
              <CountryHomePageContext
                finalData={finalData}
                indicatorsList={indicatorsList}
                regionList={regionList}
                countryList={countryList}
                countryId={countryId}
                signatureSolution={signatureSolution}
              />
            </div>
          ) : (
            <div className='undp-loader-container undp-container'>
              <div className='undp-loader' />
            </div>
          )}
        </>
      ) : (
        <div className='undp-loader-container undp-container'>
          <div className='undp-loader' />
        </div>
      )}
    </div>
  );
}

export default CountryHomePage;
