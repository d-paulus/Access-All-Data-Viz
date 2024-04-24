import { IndicatorMetaDataType } from '../../Types';
import IndicatorListComponent from './IndicatorListComponent';

interface Props {
  indicators: IndicatorMetaDataType[];
  updateIndicator: (_d: string) => void;
  closeModal: () => void;
}

function IndicatorListModal(props: Props) {
  const { indicators, updateIndicator, closeModal } = props;
  const signatureSolutions = [
    'All',
    'Infrastructure & access to social services',
    'Economic stability',
    'Gender Equality',
    'Social cohesion, gender equality & non-discrimination',
    'Environment & climate',
    'Public health',
    'Food security, agriculture & land',
    'Internal security',
    'Political stability',
    'Regional & global influences',
    'Justice & rule of law',
    'Displacement & migration',
    'Democratic space',
    'Unknown RMR Risk Area',
  ];
  return (
    <>
      {signatureSolutions.map((d, i) => (
        <div key={i}>
          <IndicatorListComponent
            title={`${d} (${
              indicators.filter(el => el.SignatureSolution.indexOf(d) !== -1)
                .length
            })`}
            indicators={indicators.filter(
              el => el.SignatureSolution.indexOf(d) !== -1,
            )}
            updateIndicator={updateIndicator}
            closeModal={closeModal}
          />
        </div>
      ))}
    </>
  );
}

export default IndicatorListModal;
