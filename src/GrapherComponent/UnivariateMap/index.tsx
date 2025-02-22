import { useContext, useEffect, useRef, useState } from 'react';
import { geoWinkel3 } from 'd3-geo-projection';
import { zoom } from 'd3-zoom';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import maxBy from 'lodash.maxby';
import max from 'lodash.max';
import UNDPColorModule from 'undp-viz-colors';
import { scaleThreshold, scaleOrdinal, scaleSqrt } from 'd3-scale';
import styled from 'styled-components';
import {
  CountryGroupDataType,
  CtxDataType,
  HoverDataType,
  HoverRowDataType,
  IndicatorMetaDataType,
} from '../../Types';
import Context from '../../Context/Context';
import World from '../../Data/worldMap.json';
import { Tooltip } from '../../Components/Tooltip';
import { COUNTRIES_BY_UNDP_REGIONS, MAP_SETTINGS } from '../../Constants';

const GraphDiv = styled.div`
  flex-grow: 1;
  @media (max-width: 960px) {
    height: 70vw;
    max-height: 31.25rem;
  }
`;

const GraphSVG = styled.svg`
  height: calc(80vh - 60px);
  min-height: calc(46.25rem - 60px);
  @media (max-width: 960px) {
    height: 70vw;
    max-height: 31.25rem;
    min-height: auto;
  }
`;

interface Props {
  data: CountryGroupDataType[];
  indicators: IndicatorMetaDataType[];
  UNDPRegion?: string;
}

export function UnivariateMap(props: Props) {
  const { data, indicators, UNDPRegion } = props;
  const {
    year,
    xAxisIndicator,
    sizeIndicator,
    selectedCountries,
    showMostRecentData,
    selectedRegions,
    selectedIncomeGroups,
    selectedCountryGroup,
  } = useContext(Context) as CtxDataType;
  const dataFilteredByUNDPRegion =
    !UNDPRegion || UNDPRegion === 'WLD'
      ? data
      : data.filter(
          el =>
            COUNTRIES_BY_UNDP_REGIONS[
              COUNTRIES_BY_UNDP_REGIONS.findIndex(
                r => r.region === `UNDP_${UNDPRegion}`,
              )
            ].Countries.indexOf(el['Alpha-3 code']) !== -1,
        );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const svgWidth = 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoWinkel3()
    .rotate([0, 0])
    .scale(
      MAP_SETTINGS[MAP_SETTINGS.findIndex(d => d.region === UNDPRegion)].scale,
    )
    .translate(
      MAP_SETTINGS[MAP_SETTINGS.findIndex(d => d.region === UNDPRegion)].center,
    );
  const xIndicatorMetaData =
    indicators[
      indicators.findIndex(indicator => indicator.DataKey === xAxisIndicator)
    ];
  const sizeIndicatorMetaData =
    indicators[
      indicators.findIndex(indicator => indicator.DataKey === sizeIndicator)
    ];
  const valueArray = xIndicatorMetaData.IsCategorical
    ? xIndicatorMetaData.Categories
    : xIndicatorMetaData.BinningRangeLarge.length === 0
    ? xIndicatorMetaData.BinningRange5
    : xIndicatorMetaData.BinningRangeLarge;
  const colorArray = xIndicatorMetaData.IsDivergent
    ? UNDPColorModule.divergentColors[
        `colorsx${
          (valueArray.length + 1 < 10
            ? `0${valueArray.length + 1}`
            : `${valueArray.length + 1}`) as '04' | '05' | '07' | '09' | '11'
        }`
      ]
    : xIndicatorMetaData.IsCategorical
    ? UNDPColorModule.sequentialColors[
        `neutralColorsx${
          (valueArray.length < 10
            ? `0${valueArray.length}`
            : `${valueArray.length}`) as
            | '04'
            | '05'
            | '06'
            | '07'
            | '08'
            | '09'
            | '10'
        }`
      ]
    : UNDPColorModule.sequentialColors[
        `neutralColorsx${
          (valueArray.length + 1 < 10
            ? `0${valueArray.length + 1}`
            : `${valueArray.length + 1}`) as
            | '04'
            | '05'
            | '06'
            | '07'
            | '08'
            | '09'
            | '10'
        }`
      ];
  const colorScale = xIndicatorMetaData.IsCategorical
    ? scaleOrdinal<number, string>().domain(valueArray).range(colorArray)
    : scaleThreshold<number, string>().domain(valueArray).range(colorArray);

  const maxRadiusValue = [0];
  if (sizeIndicator) {
    dataFilteredByUNDPRegion.forEach(d => {
      const indicatorIndex = d.indicators.findIndex(
        el => sizeIndicatorMetaData.DataKey === el.indicator,
      );
      if (indicatorIndex !== -1) {
        if (
          maxBy(d.indicators[indicatorIndex].yearlyData, el => el.value)
            ?.value !== undefined
        ) {
          maxRadiusValue.push(
            maxBy(d.indicators[indicatorIndex].yearlyData, el => el.value)
              ?.value as number,
          );
        }
      }
    });
  }
  const radiusScale = scaleSqrt()
    .domain([0, max(maxRadiusValue) as number])
    .range([0.25, 40])
    .nice();
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehavior = zoom()
      .scaleExtent([0.75, 6])
      .translateExtent([
        [-20, 0],
        [svgWidth + 20, svgHeight],
      ])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehavior as any);
  }, [svgHeight, svgWidth]);
  return (
    <GraphDiv>
      <GraphSVG
        width='100%'
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {(World as any).features.map((d: any, i: number) => {
            const index = dataFilteredByUNDPRegion.findIndex(
              (el: any) => el['Alpha-3 code'] === d.properties.ISO3,
            );
            if (index !== -1 || d.properties.NAME === 'Antarctica') return null;
            return (
              <g key={i} opacity={!selectedColor ? 1 : 0.3}>
                {d.geometry.type === 'MultiPolygon'
                  ? d.geometry.coordinates.map((el: any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== geo.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })
                  : d.geometry.coordinates.map((el: any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [
                          number,
                          number,
                        ];
                        if (k !== el.length - 1)
                          path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })}
              </g>
            );
          })}
          {dataFilteredByUNDPRegion.map((d, i: number) => {
            const index = (World as any).features.findIndex(
              (el: any) => d['Alpha-3 code'] === el.properties.ISO3,
            );
            const indicatorIndex = d.indicators.findIndex(
              el => xIndicatorMetaData.DataKey === el.indicator,
            );
            const val =
              indicatorIndex === -1
                ? undefined
                : year !== -1 && !showMostRecentData
                ? d.indicators[indicatorIndex].yearlyData[
                    d.indicators[indicatorIndex].yearlyData.findIndex(
                      el => el.year === year,
                    )
                  ]?.value
                : d.indicators[indicatorIndex].yearlyData[
                    d.indicators[indicatorIndex].yearlyData.length - 1
                  ]?.value;
            const color =
              val !== undefined
                ? colorScale(
                    xIndicatorMetaData.IsCategorical ? Math.floor(val) : val,
                  )
                : UNDPColorModule.graphNoData;

            const regionOpacity =
              selectedRegions.length === 0 ||
              selectedRegions.indexOf(d['Group 2']) !== -1;
            const incomeGroupOpacity =
              selectedIncomeGroups.length === 0 ||
              selectedIncomeGroups.indexOf(d['Income group']) !== -1;
            const countryOpacity =
              selectedCountries.length === 0 ||
              selectedCountries.indexOf(d['Country or Area']) !== -1;
            const countryGroupOpacity =
              selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];

            const rowData: HoverRowDataType[] = [
              {
                title:
                  indicators[
                    indicators.findIndex(el => el.DataKey === xAxisIndicator)
                  ].IndicatorLabel,
                value: val === undefined ? 'NA' : val,
                type: 'color',
                year:
                  indicatorIndex === -1
                    ? undefined
                    : year === -1 || showMostRecentData
                    ? d.indicators[indicatorIndex].yearlyData[
                        d.indicators[indicatorIndex].yearlyData.length - 1
                      ]?.year
                    : year,
                color,
                prefix: xIndicatorMetaData?.LabelPrefix,
                suffix: xIndicatorMetaData?.LabelSuffix,
              },
            ];
            if (sizeIndicatorMetaData) {
              const sizeIndicatorIndex = d.indicators.findIndex(
                el => sizeIndicatorMetaData?.DataKey === el.indicator,
              );
              const sizeVal =
                sizeIndicatorIndex === -1
                  ? undefined
                  : year !== -1 && !showMostRecentData
                  ? d.indicators[sizeIndicatorIndex].yearlyData[
                      d.indicators[sizeIndicatorIndex].yearlyData.findIndex(
                        el => el.year === year,
                      )
                    ]?.value
                  : d.indicators[sizeIndicatorIndex].yearlyData[
                      d.indicators[sizeIndicatorIndex].yearlyData.length - 1
                    ]?.value;
              rowData.push({
                title:
                  indicators[
                    indicators.findIndex(el => el.DataKey === sizeIndicator)
                  ].IndicatorLabel,
                value: sizeVal !== undefined ? sizeVal : 'NA',
                type: 'size',
                prefix: sizeIndicatorMetaData?.LabelPrefix,
                suffix: sizeIndicatorMetaData?.LabelSuffix,
                year:
                  sizeIndicatorIndex === -1
                    ? undefined
                    : year === -1 || showMostRecentData
                    ? d.indicators[sizeIndicatorIndex].yearlyData[
                        d.indicators[sizeIndicatorIndex].yearlyData.length - 1
                      ]?.year
                    : year,
              });
            }
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? selectedColor === color
                      ? 1
                      : 0.1
                    : regionOpacity &&
                      incomeGroupOpacity &&
                      countryOpacity &&
                      countryGroupOpacity
                    ? 1
                    : 0.1
                }
                onMouseEnter={event => {
                  setHoverData({
                    country: d['Country or Area'],
                    continent: d['Group 1'],
                    rows: rowData,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseMove={event => {
                  setHoverData({
                    country: d['Country or Area'],
                    continent: d['Group 1'],
                    rows: rowData,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseLeave={() => {
                  setHoverData(undefined);
                }}
              >
                {index === -1 || d['Country or Area'] === 'Antarctica'
                  ? null
                  : (World as any).features[index].geometry.type ===
                    'MultiPolygon'
                  ? (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: any) => {
                        let masterPath = '';
                        el.forEach((geo: number[][]) => {
                          let path = ' M';
                          geo.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== geo.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          masterPath += path;
                        });
                        return (
                          <path
                            key={j}
                            d={masterPath}
                            stroke='#AAA'
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )
                  : (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: number) => {
                        let path = 'M';
                        el.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== el.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        return (
                          <path
                            key={j}
                            d={path}
                            stroke='#AAA'
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )}
              </g>
            );
          })}
          {hoverData
            ? (World as any).features
                .filter(
                  (d: any) =>
                    d.properties.ISO3 ===
                    dataFilteredByUNDPRegion[
                      dataFilteredByUNDPRegion.findIndex(
                        el => el['Country or Area'] === hoverData?.country,
                      )
                    ]['Alpha-3 code'],
                )
                .map((d: any, i: number) => (
                  <g
                    style={{ pointerEvents: 'none' }}
                    opacity={!selectedColor ? 1 : 0}
                    key={i}
                  >
                    {d.geometry.type === 'MultiPolygon'
                      ? d.geometry.coordinates.map((el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [
                                number,
                                number,
                              ];
                              if (k !== geo.length - 1)
                                path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              key={j}
                              d={masterPath}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1}
                              fillOpacity={0}
                              fill={UNDPColorModule.graphNoData}
                            />
                          );
                        })
                      : d.geometry.coordinates.map((el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== el.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              key={j}
                              d={path}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1}
                              fillOpacity={0}
                              fill='none'
                            />
                          );
                        })}
                  </g>
                ))
            : null}
          {sizeIndicatorMetaData ? (
            <>
              {dataFilteredByUNDPRegion.map((d, i) => {
                const sizeIndicatorIndex = d.indicators.findIndex(
                  el => sizeIndicatorMetaData.DataKey === el.indicator,
                );
                const sizeVal =
                  sizeIndicatorIndex === -1
                    ? undefined
                    : year !== -1 && !showMostRecentData
                    ? d.indicators[sizeIndicatorIndex].yearlyData[
                        d.indicators[sizeIndicatorIndex].yearlyData.findIndex(
                          el => el.year === year,
                        )
                      ]?.value
                    : d.indicators[sizeIndicatorIndex].yearlyData[
                        d.indicators[sizeIndicatorIndex].yearlyData.length - 1
                      ]?.value;
                const center = projection([
                  d['Longitude (average)'],
                  d['Latitude (average)'],
                ]) as [number, number];
                const indicatorIndex = d.indicators.findIndex(
                  el => xIndicatorMetaData.DataKey === el.indicator,
                );
                const val =
                  indicatorIndex === -1
                    ? undefined
                    : year !== -1 && !showMostRecentData
                    ? d.indicators[indicatorIndex].yearlyData[
                        d.indicators[indicatorIndex].yearlyData.findIndex(
                          el => el.year === year,
                        )
                      ]?.value
                    : d.indicators[indicatorIndex].yearlyData[
                        d.indicators[indicatorIndex].yearlyData.length - 1
                      ]?.value;
                const color =
                  val !== undefined
                    ? colorScale(
                        xIndicatorMetaData.IsCategorical
                          ? Math.floor(val)
                          : val,
                      )
                    : UNDPColorModule.graphNoData;

                const regionOpacity =
                  selectedRegions.length === 0 ||
                  selectedRegions.indexOf(d['Group 2']) !== -1;
                const incomeGroupOpacity =
                  selectedIncomeGroups.length === 0 ||
                  selectedIncomeGroups.indexOf(d['Income group']) !== -1;
                const countryOpacity =
                  selectedCountries.length === 0 ||
                  selectedCountries.indexOf(d['Country or Area']) !== -1;
                const countryGroupOpacity =
                  selectedCountryGroup === 'All'
                    ? true
                    : d[selectedCountryGroup];

                const rowData: HoverRowDataType[] = [
                  {
                    title: xAxisIndicator,
                    value: val === undefined ? 'NA' : val,
                    type: 'color',
                    year:
                      indicatorIndex === -1
                        ? undefined
                        : year === -1 || showMostRecentData
                        ? d.indicators[indicatorIndex].yearlyData[
                            d.indicators[indicatorIndex].yearlyData.length - 1
                          ]?.year
                        : year,
                    color,
                    prefix: xIndicatorMetaData?.LabelPrefix,
                    suffix: xIndicatorMetaData?.LabelSuffix,
                  },
                ];
                if (sizeIndicatorMetaData) {
                  rowData.push({
                    title: sizeIndicator,
                    value: sizeVal !== undefined ? sizeVal : 'NA',
                    type: 'size',
                    prefix: sizeIndicatorMetaData?.LabelPrefix,
                    suffix: sizeIndicatorMetaData?.LabelSuffix,
                    year:
                      sizeIndicatorIndex === -1
                        ? undefined
                        : year === -1 || showMostRecentData
                        ? d.indicators[sizeIndicatorIndex].yearlyData[
                            d.indicators[sizeIndicatorIndex].yearlyData.length -
                              1
                          ]?.year
                        : year,
                  });
                }
                return (
                  <circle
                    key={i}
                    onMouseEnter={event => {
                      setHoverData({
                        country: d['Country or Area'],
                        continent: d['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={event => {
                      setHoverData({
                        country: d['Country or Area'],
                        continent: d['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                    cx={center[0]}
                    cy={center[1]}
                    r={sizeVal !== undefined ? radiusScale(sizeVal) : 0}
                    stroke='#212121'
                    strokeWidth={1}
                    fill='none'
                    opacity={
                      !hoverData
                        ? selectedColor
                          ? selectedColor === color
                            ? 1
                            : 0.1
                          : regionOpacity &&
                            incomeGroupOpacity &&
                            countryOpacity &&
                            countryGroupOpacity
                          ? 1
                          : 0.1
                        : hoverData.country === d['Country or Area']
                        ? 1
                        : 0.1
                    }
                  />
                );
              })}
            </>
          ) : null}
        </g>
      </GraphSVG>
      <div
        style={{ position: 'sticky', bottom: '0px' }}
        className='bivariate-legend-container'
      >
        <div className='univariate-legend-el'>
          <div className='univariate-map-color-legend-element'>
            <div>
              <div className='univariate-map-legend-text'>
                {xIndicatorMetaData.IndicatorLabel}
              </div>
              <svg width='100%' viewBox='0 0 320 30'>
                <g>
                  {valueArray.map((d, i) => (
                    <g
                      key={i}
                      onMouseOver={() => {
                        setSelectedColor(colorArray[i]);
                      }}
                      onMouseLeave={() => {
                        setSelectedColor(undefined);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={
                          xIndicatorMetaData.IsCategorical
                            ? (i * 320) / valueArray.length + 1
                            : (i * 320) / colorArray.length + 1
                        }
                        y={1}
                        width={
                          xIndicatorMetaData.IsCategorical
                            ? 320 / valueArray.length - 2
                            : 320 / colorArray.length - 2
                        }
                        height={8}
                        fill={colorArray[i]}
                        stroke={
                          selectedColor === colorArray[i]
                            ? '#212121'
                            : colorArray[i]
                        }
                      />
                      <text
                        x={
                          xIndicatorMetaData.IsCategorical
                            ? (i * 320) / valueArray.length +
                              160 / valueArray.length
                            : ((i + 1) * 320) / colorArray.length
                        }
                        y={25}
                        textAnchor='middle'
                        fontSize={12}
                        fill='#212121'
                      >
                        {Math.abs(d) < 1
                          ? d
                          : format('~s')(d).replace('G', 'B')}
                      </text>
                    </g>
                  ))}
                  {xIndicatorMetaData.IsCategorical ? null : (
                    <g>
                      <rect
                        onMouseOver={() => {
                          setSelectedColor(colorArray[valueArray.length]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                        x={(valueArray.length * 320) / colorArray.length + 1}
                        y={1}
                        width={320 / colorArray.length - 2}
                        height={8}
                        fill={colorArray[valueArray.length]}
                        stroke={
                          selectedColor === colorArray[valueArray.length]
                            ? '#212121'
                            : colorArray[valueArray.length]
                        }
                        strokeWidth={1}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>
          {sizeIndicator ? (
            <div>
              <div
                className='bivariate-map-size-legend-text'
                style={{ maxWidth: '10rem', lineClamp: 3 }}
              >
                {sizeIndicatorMetaData.IndicatorLabel}
              </div>
              <svg
                width='135'
                height='90'
                viewBox='0 0 175 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <text
                  fontSize={12}
                  fontWeight={700}
                  textAnchor='middle'
                  fill='#212121'
                  x={4}
                  y={95}
                >
                  0
                </text>
                <text
                  fontSize={12}
                  fontWeight={700}
                  textAnchor='middle'
                  fill='#212121'
                  x={130}
                  y={95}
                >
                  {format('~s')(radiusScale.invert(40))}
                </text>
                <path d='M4 41L130 0V80L4 41Z' fill='#E9ECF6' />
                <circle
                  cx='4'
                  cy='41'
                  r='0.25'
                  fill='white'
                  stroke='#212121'
                  strokeWidth='2'
                />
                <circle
                  cx='130'
                  cy='41'
                  r='40'
                  fill='white'
                  stroke='#212121'
                  strokeWidth='2'
                />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
      <div
        className='bivariate-legend-container'
        style={{
          justifyContent: 'flex-end',
          width: '100%',
          marginRight: 'var(--spacing-05)',
          marginBottom: 0,
        }}
      >
        <div
          className='bivariate-legend-el'
          style={{ alignItems: 'flex-start', marginBottom: 0 }}
        >
          <div className='flex-div' style={{ alignItems: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                pointerEvents: 'auto',
                padding: 'var(--spacing-01)',
                paddingRight: 'var(--spacing-05)',
                backgroundColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <p
                className='undp-typography italics margin-bottom-00'
                style={{ fontSize: '0.5rem' }}
              >
                The boundaries and names and the designations used do not imply
                official endorsement by the UN
              </p>
            </div>
          </div>
        </div>
      </div>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </GraphDiv>
  );
}
