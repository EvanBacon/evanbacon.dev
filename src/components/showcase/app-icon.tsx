import styles from '@/styles/showcase.module.scss';

const Div = 'div';
const Img = 'img';

const altSafe = (name: string) => name.replace('–', '-');
export function AppIcon({ iconUrl, name }: { iconUrl: string; name: string }) {
  return (
    <Div
      className={
        'relative flex object-cover aspect-square ' + styles.appContainer
      }
    >
      <Img
        draggable={false}
        style={{ zIndex: 1 }}
        className={'object-cover flex-1 bg-slate-800 ' + styles.appIcon}
        src={iconUrl}
        alt={`${altSafe(name)} icon`}
      />
    </Div>
  );
}
