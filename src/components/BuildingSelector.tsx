import { buildings } from '../config/buildings';
import type { BuildingConfig } from '../config/buildings';
import type { Resources } from '../types/game';
import styles from './BuildingSelector.module.css';
import { formatTime } from '../utils/timeUtils';

interface BuildingSelectorProps {
  onSelect: (buildingTypeId: string) => void;
  onCancel: () => void;
  getBuildingCount: (buildingTypeId: string) => number;
  canAfford: (cost: Resources) => boolean;
  resources: Resources;
}

function BuildingCard({
  config,
  count,
  affordable,
  resources,
  onSelect,
}: {
  config: BuildingConfig;
  count: number;
  affordable: boolean;
  resources: Resources;
  onSelect: () => void;
}) {
  const isMaxed = count >= config.maxCount;
  const isDisabled = isMaxed || !affordable;

  // Check each resource individually so only the missing ones show red
  const goldInsufficient = config.cost.gold > 0 && resources.gold < config.cost.gold;
  const woodInsufficient = config.cost.wood > 0 && resources.wood < config.cost.wood;
  const stoneInsufficient = config.cost.stone > 0 && resources.stone < config.cost.stone;
  const oreInsufficient = config.cost.ore > 0 && resources.ore < config.cost.ore;
  const foodInsufficient = config.cost.food > 0 && resources.food < config.cost.food;
  const isFree =
    config.cost.gold === 0 &&
    config.cost.wood === 0 &&
    config.cost.stone === 0 &&
    config.cost.ore === 0 &&
    config.cost.food === 0;

  const productionParts: string[] = [];
  if (config.production.gold > 0) productionParts.push(`💰${config.production.gold}`);
  if (config.production.wood > 0) productionParts.push(`🌲${config.production.wood}`);
  if (config.production.stone > 0) productionParts.push(`🪨${config.production.stone}`);
  if (config.production.ore > 0) productionParts.push(`🔩${config.production.ore}`);
  if (config.production.food > 0) productionParts.push(`🍖${config.production.food}`);
  const productionStr = productionParts.length > 0 ? productionParts.join(' ') + '/s' : null;

  return (
    <button
      className={`${styles.buildingCard} ${isDisabled ? styles.disabled : ''}`}
      onClick={onSelect}
      disabled={isDisabled}
      title={
        isMaxed
          ? `Max ${config.maxCount} allowed`
          : !affordable
            ? 'Not enough resources'
            : `Place ${config.name}`
      }
    >
      <span className={styles.icon}>{config.icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>{config.name}</span>
        <span className={styles.duration}>{formatTime(config.duration)}</span>
        <span className={styles.cost}>
          {config.cost.gold > 0 && (
            <span className={goldInsufficient ? styles.costUnaffordable : ''}>{`💰${config.cost.gold} `}</span>
          )}
          {config.cost.wood > 0 && (
            <span className={woodInsufficient ? styles.costUnaffordable : ''}>{`🌲${config.cost.wood} `}</span>
          )}
          {config.cost.stone > 0 && (
            <span className={stoneInsufficient ? styles.costUnaffordable : ''}>{`🪨${config.cost.stone} `}</span>
          )}
          {config.cost.ore > 0 && (
            <span className={oreInsufficient ? styles.costUnaffordable : ''}>{`🔩${config.cost.ore} `}</span>
          )}
          {config.cost.food > 0 && (
            <span className={foodInsufficient ? styles.costUnaffordable : ''}>{`🍖${config.cost.food} `}</span>
          )}
          {isFree && 'Free'}
        </span>
        {productionStr && <span className={styles.production}>{`+${productionStr}`}</span>}
      </div>
      <span className={styles.count}>
        {count}/{config.maxCount}
      </span>
    </button>
  );
}

export function BuildingSelector({ onSelect, onCancel, getBuildingCount, canAfford, resources }: BuildingSelectorProps) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{'Select Building'}</h2>
          <button className={styles.cancelButton} onClick={onCancel}>{'✕'}</button>
        </div>
        <div className={styles.list}>
          {buildings.map(config => (
            <BuildingCard
              key={config.id}
              config={config}
              count={getBuildingCount(config.id)}
              affordable={canAfford(config.cost)}
              resources={resources}
              onSelect={() => onSelect(config.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
