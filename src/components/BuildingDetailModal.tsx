import type { BuildingTimer } from '../types/game';
import type { BuildingConfig } from '../config/buildings';
import { formatTime } from '../utils/timeUtils';
import styles from './BuildingDetailModal.module.css';

interface BuildingDetailModalProps {
  config: BuildingConfig;
  timerState: BuildingTimer;
  isBuildLimitReached: boolean;
  onStart: () => void;
  onFinish: () => void;
  onAcknowledge: () => void;
  onClose: () => void;
}

export function BuildingDetailModal({
  config,
  timerState,
  isBuildLimitReached,
  onStart,
  onFinish,
  onAcknowledge,
  onClose,
}: BuildingDetailModalProps) {
  const currentIcon =
    timerState.level >= 5
      ? config.ultraIcon
      : timerState.level >= 2
        ? config.enhancedIcon
        : config.icon;

  const level = timerState.level;
  let productionStr: string | null = null;
  if (level > 0) {
    const multiplier = Math.pow(config.productionMultiplier, level - 1);
    const parts: string[] = [];
    if (config.production.gold > 0) parts.push(`💰${(config.production.gold * multiplier).toFixed(1)}`);
    if (config.production.wood > 0) parts.push(`🌲${(config.production.wood * multiplier).toFixed(1)}`);
    if (config.production.stone > 0) parts.push(`🪨${(config.production.stone * multiplier).toFixed(1)}`);
    if (config.production.ore > 0) parts.push(`🔩${(config.production.ore * multiplier).toFixed(1)}`);
    if (config.production.food > 0) parts.push(`🍖${(config.production.food * multiplier).toFixed(1)}`);
    if (parts.length > 0) productionStr = parts.join(' ') + '/s';
  }

  const progressColor =
    timerState.progress >= 80
      ? '#22c55e'
      : timerState.progress >= 40
        ? '#eab308'
        : '#3b82f6';

  const handleStart = () => {
    onStart();
    onClose();
  };

  const handleAcknowledge = () => {
    onAcknowledge();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.headerIcon}>{currentIcon}</span>
          <div className={styles.headerInfo}>
            <h2 className={styles.buildingName}>{config.name}</h2>
            <span className={styles.levelLabel}>{`Level ${timerState.level}`}</span>
            {productionStr && (
              <span className={styles.productionInfo}>{productionStr}</span>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>{'✕'}</button>
        </div>

        {(timerState.hasStarted || timerState.isComplete) && (
          <div className={styles.progressSection}>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${timerState.progress}%`, background: progressColor }}
              />
            </div>
            <span className={styles.progressLabel}>
              {timerState.isComplete
                ? 'Construction complete!'
                : formatTime(timerState.timeRemaining)}
            </span>
          </div>
        )}

        <div className={styles.actions}>
          {timerState.isComplete ? (
            <button className={styles.completeButton} onClick={handleAcknowledge}>
              {'✔ Complete'}
            </button>
          ) : timerState.hasStarted ? (
            timerState.timeRemaining <= 30000 ? (
              <button className={styles.finishButton} onClick={onFinish}>
                {'Finish Now'}
              </button>
            ) : null
          ) : (
            <button
              className={styles.startButton}
              onClick={handleStart}
              disabled={isBuildLimitReached}
              title={isBuildLimitReached ? 'Max concurrent builds reached' : 'Start construction'}
            >
              {'▶ Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
