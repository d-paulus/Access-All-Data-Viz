import { createContext } from 'react';
import { CtxDataType, DisaggregationMetaDataType } from '../Types';

const Context = createContext<CtxDataType>({
  graphType: 'map',
  selectedRegions: [],
  selectedCountries: [],
  selectedIncomeGroups: [],
  selectedCountryGroup: 'All',
  showMostRecentData: false,
  year: 2022,
  xAxisIndicator: '',
  disaggregationIndicator: undefined,
  disaggregationGraphType: 'global',
  disaggregationOrder: 'first',
  yAxisIndicator: '',
  colorIndicator: '',
  sizeIndicator: '',
  showLabel: false,
  trendChartCountry: undefined,
  dataListCountry: 'Afghanistan',
  useSameRange: false,
  reverseOrder: true,
  verticalBarLayout: true,
  multiCountryTrendChartCountries: [
    'China',
    'India',
    'United States of America',
    'Indonesia',
    'Pakistan',
  ],
  selectedCountryOrRegion: undefined,
  signatureSolution: undefined,
  signatureSolutionForDataList: 'All',
  showReference: false,
  keepAxisSame: false,
  xScaleType: 'linear',
  yScaleType: 'linear',
  updateGraphType: (
    _d:
      | 'scatterPlot'
      | 'map'
      | 'barGraph'
      | 'trendLine'
      | 'multiCountryTrendLine'
      | 'dataList'
      | 'disaggregation',
  ) => {},
  updateSelectedRegions: (_d: string[]) => {},
  updateSelectedCountries: (_d: string[]) => {},
  updateSelectedIncomeGroups: (_d: string[]) => {},
  updateDisaggregationIndicator: (_d: DisaggregationMetaDataType) => {},
  updateDisaggregationGraphType: (_d: 'global' | 'country') => {},
  updateDisaggregationOrder: (_d: 'first' | 'second' | 'diff') => {},
  updateYear: (_d: number) => {},
  updateSelectedCountryGroup: (_d: 'All' | 'SIDS' | 'LLDC' | 'LDC') => {},
  updateXAxisIndicator: (_d?: string) => {},
  updateYAxisIndicator: (_d?: string) => {},
  updateColorIndicator: (_d?: string) => {},
  updateSizeIndicator: (_d?: string) => {},
  updateShowMostRecentData: (_d: boolean) => {},
  updateShowLabel: (_d: boolean) => {},
  updateUseSameRange: (_d: boolean) => {},
  updateTrendChartCountry: (_d: string) => {},
  updateDataListCountry: (_d: string) => {},
  updateMultiCountryTrendChartCountries: (_d: string[]) => {},
  updateReverseOrder: (_d: boolean) => {},
  updateBarLayout: (_d: boolean) => {},
  updateShowReference: (_d: boolean) => {},
  updateSignatureSolutionForDataList: (
    _d:
      | 'All'
      | 'Infrastructure & access to social services'
      | 'Economic stability'
      | 'Gender Equality'
      | 'Social cohesion, gender equality & non-discrimination'
      | 'Environment & climate'
      | 'Public health'
      | 'Food security, agriculture & land'
      | 'Internal security'
      | 'Political stability'
      | 'Regional & global influences'
      | 'Justice & rule of law'
      | 'Displacement & migration'
      | 'Democratic space'
      | 'Unknown RMR Risk Area',
  ) => {},
  updateKeepAxisSame: (_d: boolean) => {},
  updateXScaleType: (_d: 'linear' | 'log') => {},
  updateYScaleType: (_d: 'linear' | 'log') => {},
});

export default Context;
