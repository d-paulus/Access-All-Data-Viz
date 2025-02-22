import { useContext, useEffect, useState } from 'react';
import { Checkbox, Radio } from 'antd';
import {
  ChevronDownCircle,
  ChevronRightCircle,
  Database,
  FileDown,
} from 'lucide-react';
import {
  CountryListType,
  CtxDataType,
  IndicatorMetaDataType,
} from '../../Types';
import Context from '../../Context/Context';
import IndicatorSelector from '../../Components/IndicatorSelector';
import { Filters } from './Filters';

interface Props {
  indicators: IndicatorMetaDataType[];
  regions?: string[];
  countries: CountryListType[];
  setShowDownloadModal: (_d: boolean) => void;
  setShowSourceModal: (_d: boolean) => void;
}

export function ScatterPlotSettings(props: Props) {
  const {
    indicators,
    regions,
    countries,
    setShowDownloadModal,
    setShowSourceModal,
  } = props;
  const {
    xAxisIndicator,
    yAxisIndicator,
    sizeIndicator,
    colorIndicator,
    keepAxisSame,
    showLabel,
    showMostRecentData,
    selectedCountryOrRegion,
    showReference,
    xScaleType,
    yScaleType,
    updateColorIndicator,
    updateXAxisIndicator,
    updateYAxisIndicator,
    updateSizeIndicator,
    updateShowLabel,
    updateShowMostRecentData,
    updateShowReference,
    updateKeepAxisSame,
    updateXScaleType,
    updateYScaleType,
  } = useContext(Context) as CtxDataType;
  const scatterPlotIndicators = indicators.filter(d => !d.IsCategorical);
  const sizeIndicators = indicators.filter(d => d.Sizing);
  const options = scatterPlotIndicators.map(d => d.DataKey);
  const colorOptions = ['Continents', 'Income Groups'];
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  useEffect(() => {
    if (options.findIndex(d => d === xAxisIndicator) === -1) {
      updateXAxisIndicator(
        indicators[indicators.findIndex(d => d.DataKey === options[0])].DataKey,
      );
    }
    if (options.findIndex(d => d === yAxisIndicator) === -1) {
      updateYAxisIndicator(
        indicators[indicators.findIndex(d => d.DataKey === options[0])].DataKey,
      );
    }
  }, [options]);
  return (
    <>
      <div className='settings-sections-container'>
        <div className='settings-sections-options-container'>
          <div className='settings-option-div'>
            <IndicatorSelector
              title='X-Axis'
              indicators={scatterPlotIndicators}
              selectedIndicator={
                indicators[
                  indicators.findIndex(d => d.DataKey === xAxisIndicator)
                ]
              }
              updateIndicator={updateXAxisIndicator}
            />
          </div>
          <div className='settings-option-div'>
            <IndicatorSelector
              title='Y-Axis'
              indicators={scatterPlotIndicators}
              selectedIndicator={
                yAxisIndicator
                  ? indicators[
                      indicators.findIndex(d => d.DataKey === yAxisIndicator)
                    ]
                  : (yAxisIndicator as undefined)
              }
              updateIndicator={updateYAxisIndicator}
              isOptional={false}
            />
          </div>
          <div className='settings-option-div'>
            <IndicatorSelector
              title='Size by (optional)'
              indicators={sizeIndicators}
              selectedIndicator={
                sizeIndicator
                  ? indicators[
                      indicators.findIndex(d => d.DataKey === sizeIndicator)
                    ]
                  : (sizeIndicator as undefined)
              }
              updateIndicator={updateSizeIndicator}
              isOptional
            />
          </div>
          {selectedCountryOrRegion ? null : (
            <div className='settings-option-div'>
              <p className='label'>Color By</p>
              <Radio.Group
                className='undp-radio'
                value={colorIndicator}
                style={{ width: '100%' }}
                onChange={d => {
                  const indx = indicators.findIndex(
                    indicator => indicator.IndicatorLabel === d.target.value,
                  );
                  updateColorIndicator(
                    indx === -1 ? d.target.value : indicators[indx].DataKey,
                  );
                }}
                defaultValue='Continent'
              >
                {colorOptions.map(d => (
                  <Radio
                    key={
                      indicators.findIndex(el => el.DataKey === d) === -1
                        ? d
                        : indicators[
                            indicators.findIndex(el => el.DataKey === d)
                          ].IndicatorLabel
                    }
                    value={
                      indicators.findIndex(el => el.DataKey === d) === -1
                        ? d
                        : indicators[
                            indicators.findIndex(el => el.DataKey === d)
                          ].IndicatorLabel
                    }
                  >
                    {indicators.findIndex(el => el.DataKey === d) === -1
                      ? d
                      : indicators[indicators.findIndex(el => el.DataKey === d)]
                          .IndicatorLabel}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}
        </div>
        <div className='flex-div flex-wrap margin-top-06 margin-bottom-03 gap-06'>
          <button
            className='undp-button button-tertiary'
            type='button'
            style={{ color: 'var(--blue-600)', padding: 0 }}
            onClick={() => {
              setShowSourceModal(true);
            }}
          >
            <Database
              stroke='var(--blue-600)'
              style={{ marginRight: '0.25rem' }}
              strokeWidth={1.25}
            />
            Data Sources
          </button>
          <button
            className='undp-button button-tertiary'
            type='button'
            style={{ color: 'var(--blue-600)', padding: 0 }}
            onClick={() => {
              setShowDownloadModal(true);
            }}
          >
            <FileDown
              strokeWidth={1.25}
              stroke='var(--blue-600)'
              style={{ marginRight: '0.25rem' }}
            />
            Download
          </button>
        </div>
      </div>
      <div className='settings-sections-container'>
        <button
          type='button'
          aria-label='Expand or collapse settings'
          className='settings-sections-container-title'
          onClick={() => {
            setSettingsExpanded(!settingsExpanded);
          }}
        >
          {settingsExpanded ? (
            <ChevronDownCircle stroke='#212121' size={18} />
          ) : (
            <ChevronRightCircle stroke='#212121' size={18} />
          )}
          <h6 className='undp-typography margin-bottom-00'>
            Settings & Options
          </h6>
        </button>
        <div
          className='settings-sections-options-container'
          style={{ display: settingsExpanded ? 'flex' : 'none' }}
        >
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={showLabel}
            onChange={e => {
              updateShowLabel(e.target.checked);
            }}
          >
            Show Label
          </Checkbox>
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={showMostRecentData}
            onChange={e => {
              updateShowMostRecentData(e.target.checked);
            }}
          >
            Show Most Recent Available Data
          </Checkbox>
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={showReference}
            onChange={e => {
              updateShowReference(e.target.checked);
            }}
          >
            Show World/Regional Reference
          </Checkbox>
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={keepAxisSame}
            onChange={e => {
              updateKeepAxisSame(e.target.checked);
            }}
          >
            Use same axes to compare between years
          </Checkbox>
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={xScaleType === 'log'}
            onChange={e => {
              updateXScaleType(e.target.checked ? 'log' : 'linear');
            }}
          >
            Use log scale for x-axis
          </Checkbox>
          <Checkbox
            style={{ margin: 0 }}
            className='undp-checkbox'
            checked={yScaleType === 'log'}
            onChange={e => {
              updateYScaleType(e.target.checked ? 'log' : 'linear');
            }}
          >
            Use log scale for y-axis
          </Checkbox>
        </div>
      </div>
      {!selectedCountryOrRegion && countries.length > 1 ? (
        <Filters regions={regions} countries={countries} />
      ) : null}
    </>
  );
}
