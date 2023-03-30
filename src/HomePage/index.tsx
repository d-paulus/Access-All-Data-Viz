/* eslint-disable jsx-a11y/iframe-has-title */
import { useState, useEffect } from 'react';
import flattenDeep from 'lodash.flattendeep';
import sortedUniq from 'lodash.sorteduniq';
import { json } from 'd3-request';
import uniqBy from 'lodash.uniqby';
import { queue } from 'd3-queue';
import sortBy from 'lodash.sortby';
import {
  CountryGroupDataType, IndicatorMetaDataType, IndicatorMetaDataWithYear, CountryListType,
} from '../Types';
import {
  COUNTRIES_BY_UNDP_REGIONS,
  DATALINK, METADATALINK,
} from '../Constants';
import HomePageContext from './HomePage';

interface Props {
  signatureSolution?: string;
  region?: string;
}

const HomePage = (props:Props) => {
  const {
    signatureSolution,
    region,
  } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [finalData, setFinalData] = useState<CountryGroupDataType[] | undefined>(undefined);
  const [indicatorsList, setIndicatorsList] = useState<IndicatorMetaDataWithYear[] | undefined>(undefined);
  const [regionList, setRegionList] = useState<string[] | undefined>(undefined);
  const [countryList, setCountryList] = useState<CountryListType[] | undefined>(undefined);

  useEffect(() => {
    queue()
      .defer(json, DATALINK)
      .defer(json, METADATALINK)
      .await((err: any, data: CountryGroupDataType[], indicatorMetaData: IndicatorMetaDataType[]) => {
        if (err) throw err;
        const topic = queryParams.get('topic');
        const dataFilteredByRegion = region ? data.filter((d) => COUNTRIES_BY_UNDP_REGIONS[COUNTRIES_BY_UNDP_REGIONS.findIndex((el) => el.region === `UNDP_${region}`)].Countries.indexOf(d['Alpha-3 code']) !== -1) : data;
        setFinalData(dataFilteredByRegion);
        setCountryList(dataFilteredByRegion.map((d) => ({ name: d['Country or Area'], code: d['Alpha-3 code'] })));
        setRegionList(uniqBy(dataFilteredByRegion, (d) => d['Group 2']).map((d) => d['Group 2']));
        const indicatorsFilteredBySS = signatureSolution ? sortBy(indicatorMetaData, (d) => d.IndicatorLabelTable).filter((d) => d.SignatureSolution.indexOf(signatureSolution) !== -1) : sortBy(indicatorMetaData, (d) => d.IndicatorLabelTable);
        const indicatorsFiltered = topic ? indicatorsFilteredBySS.filter((d) => d.SSTopics.indexOf(topic) !== -1) : indicatorsFilteredBySS;
        const indicatorWithYears: IndicatorMetaDataWithYear[] = indicatorsFiltered.map((d) => {
          const years: number[][] = [];
          dataFilteredByRegion.forEach((el) => {
            const indYears = el.indicators[el.indicators.findIndex((ind) => ind.indicator === d.DataKey)]?.yearlyData.map((year) => year.year);
            if (indYears) years.push(indYears);
          });
          return {
            ...d,
            years: sortedUniq(flattenDeep(years).sort()),
          };
        });
        setIndicatorsList(indicatorWithYears);
      });
  }, []);
  return (
    <>
      {
        indicatorsList && finalData && regionList && countryList
          ? (
            <div className='undp-container'>
              <HomePageContext
                finalData={finalData}
                region={region}
                indicatorsList={indicatorsList}
                regionList={regionList}
                countryList={countryList}
                signatureSolution={signatureSolution}
              />
            </div>
          )
          : (
            <div className='undp-loader-container undp-container'>
              <div className='undp-loader' />
            </div>
          )
      }
    </>
  );
};

export default HomePage;
