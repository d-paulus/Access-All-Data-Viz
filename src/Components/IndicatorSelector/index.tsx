import { Input, Modal, Select } from 'antd';
import { ChevronDown, Info, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import intersection from 'lodash.intersection';
import { IndicatorMetaDataType } from '../../Types';
import IndicatorListModal from './IndicatorListModal';
import { SDG_GOALS, TAGS_LIST } from '../../Constants';

interface Props {
  title: string;
  indicators: IndicatorMetaDataType[];
  selectedIndicator?: IndicatorMetaDataType;
  updateIndicator: (_d?: string) => void;
  isOptional?: boolean;
}

const DropDownButton = styled.button`
  border: 2px solid var(--black);
  padding: 0.5rem;
  background-color: transparent;
  text-transform: uppercase;
  font-size: 0.875rem !important;
  font-weight: 600;
  width: calc(100% - 42px);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TruncateDiv = styled.div`
  width: calc(100% - 48px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem !important;
  font-family: var(--fontFamily);
  text-align: left;
`;

interface IconDivProps {
  active: boolean;
}

const IconDiv = styled.div<IconDivProps>`
  height: 24px;
  padding: 0;
  cursor: ${props => (props.active ? 'pointer' : 'not-allowed')};
  &:hover {
    background-color: ${props =>
      props.active ? 'var(--gray-300)' : 'transparent'};
  }
`;

interface TooltipElProps {
  x: number;
  y: number;
}

interface InfoProps extends TooltipElProps {
  x: number;
  y: number;
  info: string;
  description: string;
  source: string;
}
const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 1000;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  padding: 0.5rem;
  font-size: 0.875rem !important;
  top: ${props => props.y - 20}px;
  left: ${props => props.x + 20}px;
  max-width: 15rem;
`;

function IndicatorSelector(props: Props) {
  const { title, indicators, selectedIndicator, updateIndicator, isOptional } =
    props;
  const [openModal, setOpenModal] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState<undefined | string>(
    undefined,
  );
  const [indicatorList, setIndicatorList] =
    useState<IndicatorMetaDataType[]>(indicators);
  const [indicatorInfo, setIndicatorInfo] = useState<InfoProps | undefined>(
    undefined,
  );
  const [sdgForFilter, setSDGForFilter] = useState<string[]>([]);
  const [tagsForFilter, setTagsForFilter] = useState<string[]>([]);
  const sourceList = [
    'International Monetary Fund WEO',
    'IEP - Global Peace Index',
    'Transparency International',
    'The Fund for Peace',
    'IDMC - Internally displaced people',
    'SDG Index - Sachs et al.',
    'World Bank WDI',
    'International Energy Agency',
    'Notre Dame Global Adaptation Initiative (ND GAIN)',
    'UNODC - Intentional Homicide',
    'UNDP - Human Development Index',
  ];
  const [sourcesForFilter, setSourcesForFilter] = useState<string[]>([]);

  useEffect(() => {
    const indicatorFilterByTags =
      tagsForFilter.length !== 0 && tagsForFilter
        ? indicators.filter(d => intersection(d.Tags, tagsForFilter).length > 0)
        : indicators;
    const indicatorFilterBySources =
      sourcesForFilter.length > 0
        ? indicatorFilterByTags.filter(d =>
            sourcesForFilter.includes(d.DataSourceName),
          )
        : indicatorFilterByTags;
    const indicatorFilterBySDGs =
      sdgForFilter.length !== 0 && sdgForFilter
        ? indicatorFilterBySources.filter(
            d => intersection(d.SDGs, sdgForFilter).length > 0,
          )
        : indicatorFilterBySources;
    const indicatorsFiltered = searchPhrase
      ? sortBy(indicatorFilterBySDGs, d => d.IndicatorLabel).filter(
          d =>
            d.IndicatorLabel.toLowerCase().includes(
              searchPhrase.toLowerCase(),
            ) ||
            d.IndicatorDescription.toLowerCase().includes(
              searchPhrase.toLowerCase(),
            ),
        )
      : sortBy(indicatorFilterBySDGs, d => d.IndicatorLabel);
    setIndicatorList(openModal ? indicatorsFiltered : indicators);
  }, [searchPhrase, sourcesForFilter, sdgForFilter, tagsForFilter, openModal]);
  const closeModal = () => {
    setTagsForFilter([]);
    setSDGForFilter([]);
    setSearchPhrase(undefined);
    setOpenModal(false);
  };
  return (
    <>
      <div className='settings-option-div'>
        <p className='label'>{title}</p>
        <div
          className='flex-div flex-vert-align-center'
          style={{ gap: '0.5rem' }}
        >
          <DropDownButton
            style={{
              width: 'calc(100% - 72px)',
            }}
            onClick={() => {
              setOpenModal(true);
            }}
            title={selectedIndicator?.IndicatorLabel || 'Select an indicator'}
          >
            <TruncateDiv>
              {selectedIndicator?.IndicatorLabel || 'Select an indicator'}
            </TruncateDiv>
            <ChevronDown size={24} stroke='var(--red)' />
          </DropDownButton>
          <IconDiv active={!!selectedIndicator}>
            <Info
              size={24}
              stroke={selectedIndicator ? 'var(--red)' : 'var(--gray-400)'}
              onMouseEnter={event => {
                if (selectedIndicator)
                  setIndicatorInfo({
                    info: selectedIndicator.IndicatorLabel,
                    description: selectedIndicator.IndicatorDescription,
                    source: selectedIndicator.DataSourceName,
                    x: event.clientX,
                    y: event.clientY,
                  });
              }}
              onMouseMove={event => {
                if (selectedIndicator)
                  setIndicatorInfo({
                    info: selectedIndicator.IndicatorLabel,
                    description: selectedIndicator.IndicatorDescription,
                    source: selectedIndicator.DataSourceName,
                    x: event.clientX,
                    y: event.clientY,
                  });
              }}
              onMouseLeave={() => {
                if (selectedIndicator) setIndicatorInfo(undefined);
              }}
              strokeWidth={1.25}
            />
          </IconDiv>
          <IconDiv active={!!(isOptional && selectedIndicator)}>
            <Trash
              size={24}
              stroke={
                isOptional && selectedIndicator
                  ? 'var(--red)'
                  : 'var(--gray-400)'
              }
              onClick={() => {
                if (isOptional && selectedIndicator) updateIndicator(undefined);
              }}
              strokeWidth={1.25}
            />
          </IconDiv>
        </div>
      </div>
      {indicatorInfo ? (
        <TooltipEl
          className='undp-typography'
          x={indicatorInfo.x}
          y={indicatorInfo.y}
        >
          <p className='undp-typography small-font margin-bottom-00 bold'>
            {indicatorInfo.info}
          </p>
          <p className='undp-typography small-font margin-bottom-02'>
            {indicatorInfo.description}
          </p>
          <p className='undp-typography small-font margin-bottom-00'>
            Source:{' '}
            <span className='bold undp-typography small-font'>
              {indicatorInfo.source}
            </span>
          </p>
        </TooltipEl>
      ) : null}
      <Modal
        open={openModal}
        className='undp-modal'
        title={`All Indicators (${indicators.length})`}
        onOk={() => {
          setTagsForFilter([]);
          setSDGForFilter([]);
          setSearchPhrase(undefined);
          setOpenModal(false);
        }}
        onCancel={() => {
          setTagsForFilter([]);
          setSDGForFilter([]);
          setSearchPhrase(undefined);
          setOpenModal(false);
        }}
        destroyOnClose
        style={{ maxWidth: '90%' }}
      >
        <div className='margin-bottom-07 flex-div'>
          <div
            style={{
              flexGrow: 1,
              minWidth: '17.5rem',
              width: 'calc(25% - 0.75rem)',
            }}
          >
            <p className='label'>Filter by source</p>
            <Select
              className='undp-select'
              showSearch
              maxTagCount='responsive'
              style={{ width: '100%' }}
              allowClear
              clearIcon={<div className='clearIcon' />}
              placeholder='All Sources'
              onChange={d => {
                setSourcesForFilter(d);
              }}
              value={sourcesForFilter}
            >
              {sourceList.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              flexGrow: 1,
              minWidth: '17.5rem',
              width: 'calc(50% - 0.5rem)',
            }}
          >
            {/* <p className='label'>Filter by tags</p> */}
            <p className='label'> </p>
            <Select
              className='undp-select'
              showSearch
              maxTagCount='responsive'
              style={{ width: '100%', display: 'none' }}
              mode='multiple'
              allowClear
              clearIcon={<div className='clearIcon' />}
              placeholder='All Tags'
              onChange={d => {
                setTagsForFilter(d);
              }}
              value={tagsForFilter}
            >
              {TAGS_LIST.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              flexGrow: 1,
              minWidth: '17.5rem',
              width: 'calc(50% - 0.5rem)',
            }}
          >
            {/* <p className='label'>Filter by SDGs</p> */}
            <p className='label'> </p>
            <Select
              className='undp-select'
              showSearch
              maxTagCount='responsive'
              style={{ width: '100%', display: 'none' }}
              mode='multiple'
              allowClear
              clearIcon={<div className='clearIcon' />}
              placeholder='All SDGs'
              onChange={d => {
                setSDGForFilter(d);
              }}
              value={sdgForFilter}
            >
              {SDG_GOALS.map(d => (
                <Select.Option
                  className='undp-select-option'
                  key={d.split(':')[0]}
                >
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div className='margin-bottom-05 flex-div'>
          <Input
            className='undp-input'
            placeholder='Search Indicator'
            onChange={d => setSearchPhrase(d.target.value)}
          />
          <Search stroke='var(--gray-400)' size={48} />
        </div>
        <IndicatorListModal
          indicators={indicatorList}
          updateIndicator={updateIndicator}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
}

export default IndicatorSelector;
