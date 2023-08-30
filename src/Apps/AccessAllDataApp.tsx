import { Tabs } from 'antd';
import DataExplorer from '../Components/DataExplorer';
import { DataSetList } from '../Components/DataSetList';
import { AggregatedRegionVisualization } from '../RegionVisualization';

export function AccessAllDataApp() {
  const mainTabs = [
    {
      key: 'dataExplorer',
      label: 'Data Explorer',
      children: <DataExplorer region={{ code: 'WLD', name: 'World' }} />,
    },
    {
      key: 'aggregatedDataExplorer',
      label: 'Aggregated Data Explorer',
      children: <AggregatedRegionVisualization UNDPRegion='WLD' />,
    },
    {
      key: 'datasets',
      label: 'Datasets',
      children: <DataSetList />,
    },
  ];
  return (
    <div className='undp-container'>
      <div
        style={{
          backgroundColor: 'var(--gray-300)',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-07)',
          }}
        >
          <h2 className='undp-typography margin-bottom-00'>Access All Data</h2>
        </div>
      </div>
      <Tabs
        defaultActiveKey='dataExplorer'
        className='undp-tabs subhead-tabs'
        items={mainTabs.map(d => ({
          label: d.label,
          key: d.key,
          children: d.children,
        }))}
      />
    </div>
  );
}
