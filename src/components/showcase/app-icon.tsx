import styles from '@/styles/showcase.module.scss';

export function AppIcon({ iconUrl, name }: { iconUrl: string; name: string }) {
  return (
    <div
      className={
        'relative flex object-cover aspect-square ' + styles.appContainer
      }
    >
      <img
        draggable={false}
        style={{ zIndex: 1 }}
        className={'object-cover flex-1 bg-slate-800 ' + styles.appIcon}
        src={iconUrl}
        alt={`${name} icon`}
      />
    </div>
  );
}
