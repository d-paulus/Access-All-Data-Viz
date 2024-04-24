import { useContext } from 'react';
import { Select } from 'antd';
import { CountryListType, CtxDataType } from '../../Types';
import Context from '../../Context/Context';
import { SIGNATURE_SOLUTIONS_LIST } from '../../Constants';

interface Props {
  countries: CountryListType[];
}

export function DataListSettings(props: Props) {
  const { countries } = props;
  const {
    selectedCountryOrRegion,
    dataListCountry,
    signatureSolution,
    signatureSolutionForDataList,
    updateDataListCountry,
    updateSignatureSolutionForDataList,
  } = useContext(Context) as CtxDataType;
  return (
    <div className='settings-sections-container'>
      <div className='settings-sections-options-container'>
        {selectedCountryOrRegion === undefined && countries.length > 1 ? (
          <div className='settings-option-div'>
            <p className='label'>Select a Country</p>
            <Select
              showSearch
              className='undp-select'
              placeholder='Please select a country'
              value={selectedCountryOrRegion || dataListCountry}
              onChange={d => {
                updateDataListCountry(d);
              }}
              disabled={selectedCountryOrRegion !== undefined}
            >
              {countries
                .map(d => d.name)
                .map(d => (
                  <Select.Option className='undp-select-option' key={d}>
                    {d}
                  </Select.Option>
                ))}
            </Select>
          </div>
        ) : null}
        <div className='settings-option-div'>
          <p className='label'>Filter by RMR Risk Area</p>
          <Select
            showSearch
            className='undp-select'
            placeholder='Please select'
            value={signatureSolution || signatureSolutionForDataList}
            disabled={signatureSolution !== undefined}
            onChange={d => {
              updateSignatureSolutionForDataList(
                d as
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
              );
            }}
          >
            {SIGNATURE_SOLUTIONS_LIST.map(d => (
              <Select.Option className='undp-select-option' key={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
